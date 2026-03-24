package com.agentic.stocktracker.api.service;

import com.agentic.stocktracker.api.dto.*;
import com.agentic.stocktracker.api.entity.*;
import com.agentic.stocktracker.api.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final PortfolioStockRepository portfolioStockRepository;
    private final StockRepository stockRepository;
    private final TradeHistoryRepository tradeHistoryRepository;
    private final StockService stockService;

    public PortfolioService(PortfolioRepository portfolioRepository,
                            PortfolioStockRepository portfolioStockRepository,
                            StockRepository stockRepository,
                            TradeHistoryRepository tradeHistoryRepository,
                            StockService stockService) {
        this.portfolioRepository = portfolioRepository;
        this.portfolioStockRepository = portfolioStockRepository;
        this.stockRepository = stockRepository;
        this.tradeHistoryRepository = tradeHistoryRepository;
        this.stockService = stockService;
    }

    public PortfolioDto getPortfolio(String type) {
        Portfolio portfolio = portfolioRepository.findByType(type).orElseThrow(() ->
                new IllegalArgumentException("Portfolio not found: " + type));
        List<PortfolioStock> rows = portfolioStockRepository.findByPortfolio(portfolio);

        List<PositionDto> positions = rows.stream().map(ps -> {
            String region = resolveRegion(ps.getStock().getExchange());
            StockDto quote;
            try {
                quote = stockService.getStockData(region, ps.getStock().getSymbol());
            } catch (Exception e) {
                // fallback to stored price if live fetch fails
                quote = StockDto.builder()
                        .symbol(ps.getStock().getSymbol())
                        .name(ps.getStock().getName())
                        .exchange(ps.getStock().getExchange())
                        .country(ps.getStock().getCountry())
                        .currency(ps.getStock().getCurrency())
                        .currentPrice(ps.getStock().getCurrentPrice() != null ? ps.getStock().getCurrentPrice() : 0.0)
                        .build();
            }
            double pl = (quote.getCurrentPrice() - ps.getAveragePrice()) * ps.getQuantity();
            double cost = ps.getAveragePrice() * ps.getQuantity();
            double plPercent = cost > 0 ? (pl / cost) * 100.0 : 0.0;
            double marketValue = quote.getCurrentPrice() * ps.getQuantity();

            return PositionDto.builder()
                    .positionId(ps.getId())
                    .symbol(ps.getStock().getSymbol())
                    .name(quote.getName() != null ? quote.getName() : ps.getStock().getName())
                    .exchange(ps.getStock().getExchange())
                    .currency(quote.getCurrency())
                    .quantity(ps.getQuantity())
                    .averagePrice(ps.getAveragePrice())
                    .currentPrice(quote.getCurrentPrice())
                    .pl(pl)
                    .plPercent(plPercent)
                    .marketValue(marketValue)
                    .build();
        }).toList();

        double totalValue = positions.stream().mapToDouble(PositionDto::getMarketValue).sum();
        double totalCost  = positions.stream().mapToDouble(p -> p.getAveragePrice() * p.getQuantity()).sum();
        double totalPl    = totalValue - totalCost;
        double totalPlPct = totalCost > 0 ? (totalPl / totalCost) * 100.0 : 0.0;

        return PortfolioDto.builder()
                .type(type)
                .positions(positions)
                .totalValue(totalValue)
                .totalCost(totalCost)
                .totalPl(totalPl)
                .totalPlPercent(totalPlPct)
                .build();
    }

    @Transactional
    public void addPosition(String portfolioType, AddPositionRequest req) {
        if (req.getSymbol() == null || req.getSymbol().isBlank()) throw new IllegalArgumentException("symbol required");
        if (req.getQuantity() == null || req.getQuantity() <= 0) throw new IllegalArgumentException("quantity must be positive");
        if (req.getAveragePrice() == null || req.getAveragePrice() <= 0) throw new IllegalArgumentException("averagePrice must be positive");

        Portfolio portfolio = portfolioRepository.findByType(portfolioType)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found: " + portfolioType));

        String symbol = req.getSymbol().trim().toUpperCase();
        String region = req.getRegion() != null ? req.getRegion() : resolveRegionFromExchange(req.getExchange());

        // Fetch live quote to get current metadata
        StockDto quote;
        try {
            quote = stockService.getStockData(region, symbol);
        } catch (Exception e) {
            quote = StockDto.builder().symbol(symbol).name(symbol)
                    .exchange(req.getExchange() != null ? req.getExchange().toUpperCase() : "NASDAQ")
                    .country(region.equalsIgnoreCase("india") ? "IN" : "US")
                    .currency(region.equalsIgnoreCase("india") ? "INR" : "USD")
                    .currentPrice(req.getAveragePrice()).build();
        }

        String exchange = req.getExchange() != null ? req.getExchange().toUpperCase() : quote.getExchange();
        final StockDto resolvedQuote = quote;

        // Upsert stock master record
        Stock stock = stockRepository.findBySymbolAndExchange(symbol, exchange)
                .orElseGet(() -> stockRepository.save(Stock.builder()
                        .symbol(symbol)
                        .name(resolvedQuote.getName())
                        .exchange(exchange)
                        .country(resolvedQuote.getCountry())
                        .currency(resolvedQuote.getCurrency())
                        .currentPrice(resolvedQuote.getCurrentPrice())
                        .lastUpdatedAt(LocalDateTime.now())
                        .build()));

        // Update stock price
        stock.setCurrentPrice(quote.getCurrentPrice());
        stock.setLastUpdatedAt(LocalDateTime.now());
        stockRepository.save(stock);

        // Check if position already exists → weighted average update
        List<PortfolioStock> existing = portfolioStockRepository.findByPortfolio(portfolio);
        var match = existing.stream()
                .filter(ps -> ps.getStock().getSymbol().equalsIgnoreCase(symbol)
                        && ps.getStock().getExchange().equalsIgnoreCase(exchange))
                .findFirst();

        if (match.isPresent()) {
            PortfolioStock ps = match.get();
            int newQty = ps.getQuantity() + req.getQuantity();
            double newAvg = ((ps.getAveragePrice() * ps.getQuantity()) + (req.getAveragePrice() * req.getQuantity())) / newQty;
            ps.setQuantity(newQty);
            ps.setAveragePrice(newAvg);
            portfolioStockRepository.save(ps);
        } else {
            portfolioStockRepository.save(PortfolioStock.builder()
                    .portfolio(portfolio)
                    .stock(stock)
                    .quantity(req.getQuantity())
                    .averagePrice(req.getAveragePrice())
                    .build());
        }

        // Record trade history
        tradeHistoryRepository.save(TradeHistory.builder()
                .symbol(symbol)
                .stockName(quote.getName())
                .exchange(exchange)
                .currency(quote.getCurrency())
                .tradeType("BUY")
                .quantity(req.getQuantity())
                .price(req.getAveragePrice())
                .totalValue(req.getAveragePrice() * req.getQuantity())
                .portfolioType(portfolioType)
                .tradeDate(LocalDateTime.now())
                .build());
    }

    @Transactional
    public void removePosition(String portfolioType, String symbol, String exchange) {
        Portfolio portfolio = portfolioRepository.findByType(portfolioType)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found: " + portfolioType));

        var list = portfolioStockRepository.findByPortfolio(portfolio);
        var match = list.stream()
                .filter(ps -> ps.getStock().getSymbol().equalsIgnoreCase(symbol)
                        && (exchange == null || exchange.equalsIgnoreCase(ps.getStock().getExchange())))
                .findFirst().orElseThrow(() -> new IllegalArgumentException("Position not found"));

        tradeHistoryRepository.save(TradeHistory.builder()
                .symbol(match.getStock().getSymbol())
                .stockName(match.getStock().getName())
                .exchange(match.getStock().getExchange())
                .currency(match.getStock().getCurrency())
                .tradeType("REMOVE")
                .quantity(match.getQuantity())
                .price(match.getAveragePrice())
                .totalValue(match.getAveragePrice() * match.getQuantity())
                .portfolioType(portfolioType)
                .tradeDate(LocalDateTime.now())
                .build());

        portfolioStockRepository.delete(match);
    }

    @Transactional
    public void sellPosition(SellPositionRequest req) {
        Portfolio actual = portfolioRepository.findByType("actual")
                .orElseThrow(() -> new IllegalArgumentException("Actual portfolio missing"));

        var list = portfolioStockRepository.findByPortfolio(actual);
        var match = list.stream()
                .filter(ps -> ps.getStock().getSymbol().equalsIgnoreCase(req.getSymbol())
                        && (req.getExchange() == null || req.getExchange().equalsIgnoreCase(ps.getStock().getExchange())))
                .findFirst().orElseThrow(() -> new IllegalArgumentException("Position not found"));

        int sellQty = (req.getQuantity() == null || req.getQuantity() >= match.getQuantity())
                ? match.getQuantity() : req.getQuantity();
        double sellPrice = req.getSellPrice() != null ? req.getSellPrice() : match.getStock().getCurrentPrice();

        tradeHistoryRepository.save(TradeHistory.builder()
                .symbol(match.getStock().getSymbol())
                .stockName(match.getStock().getName())
                .exchange(match.getStock().getExchange())
                .currency(match.getStock().getCurrency())
                .tradeType("SELL")
                .quantity(sellQty)
                .price(sellPrice)
                .totalValue(sellPrice * sellQty)
                .portfolioType("actual")
                .tradeDate(LocalDateTime.now())
                .notes("Avg cost: " + match.getAveragePrice())
                .build());

        if (sellQty >= match.getQuantity()) {
            portfolioStockRepository.delete(match);
        } else {
            match.setQuantity(match.getQuantity() - sellQty);
            portfolioStockRepository.save(match);
        }
    }

    @Transactional
    public void moveToHypothetical(String symbol, String exchange) {
        Portfolio actual = portfolioRepository.findByType("actual")
                .orElseThrow(() -> new IllegalArgumentException("Actual portfolio missing"));
        Portfolio hypo = portfolioRepository.findByType("hypothetical")
                .orElseThrow(() -> new IllegalArgumentException("Hypothetical portfolio missing"));

        var list = portfolioStockRepository.findByPortfolio(actual);
        var match = list.stream().filter(ps -> ps.getStock().getSymbol().equalsIgnoreCase(symbol)
                && (exchange == null || exchange.equalsIgnoreCase(ps.getStock().getExchange())))
                .findFirst().orElseThrow(() -> new IllegalArgumentException("Position not found"));

        PortfolioStock copy = PortfolioStock.builder()
                .portfolio(hypo)
                .stock(match.getStock())
                .quantity(match.getQuantity())
                .averagePrice(match.getAveragePrice())
                .build();
        portfolioStockRepository.save(copy);
        portfolioStockRepository.delete(match);

        tradeHistoryRepository.save(TradeHistory.builder()
                .symbol(match.getStock().getSymbol())
                .stockName(match.getStock().getName())
                .exchange(match.getStock().getExchange())
                .currency(match.getStock().getCurrency())
                .tradeType("MOVE_OUT")
                .quantity(match.getQuantity())
                .price(match.getAveragePrice())
                .totalValue(match.getAveragePrice() * match.getQuantity())
                .portfolioType("actual")
                .tradeDate(LocalDateTime.now())
                .notes("Moved to hypothetical")
                .build());
    }

    public List<TradeHistoryDto> getTradeHistory() {
        return tradeHistoryRepository.findAllByOrderByTradeDateDesc().stream()
                .map(t -> TradeHistoryDto.builder()
                        .id(t.getId())
                        .symbol(t.getSymbol())
                        .stockName(t.getStockName())
                        .exchange(t.getExchange())
                        .currency(t.getCurrency())
                        .tradeType(t.getTradeType())
                        .quantity(t.getQuantity())
                        .price(t.getPrice())
                        .totalValue(t.getTotalValue())
                        .portfolioType(t.getPortfolioType())
                        .tradeDate(t.getTradeDate() != null ? t.getTradeDate().toString() : null)
                        .notes(t.getNotes())
                        .build())
                .toList();
    }

    private String resolveRegion(String exchange) {
        if (exchange == null) return "us";
        return exchange.equalsIgnoreCase("NSE") || exchange.equalsIgnoreCase("BSE") ? "india" : "us";
    }

    private String resolveRegionFromExchange(String exchange) {
        if (exchange == null) return "us";
        return exchange.equalsIgnoreCase("NSE") || exchange.equalsIgnoreCase("BSE") ? "india" : "us";
    }
}
