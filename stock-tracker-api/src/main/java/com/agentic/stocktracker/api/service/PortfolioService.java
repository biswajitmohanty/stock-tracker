package com.agentic.stocktracker.api.service;

import com.agentic.stocktracker.api.dto.PortfolioDto;
import com.agentic.stocktracker.api.dto.PositionDto;
import com.agentic.stocktracker.api.dto.StockDto;
import com.agentic.stocktracker.api.entity.Portfolio;
import com.agentic.stocktracker.api.entity.PortfolioStock;
import com.agentic.stocktracker.api.repository.PortfolioRepository;
import com.agentic.stocktracker.api.repository.PortfolioStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final PortfolioStockRepository portfolioStockRepository;
    private final StockService stockService;

    public PortfolioService(PortfolioRepository portfolioRepository,
                            PortfolioStockRepository portfolioStockRepository,
                            StockService stockService) {
        this.portfolioRepository = portfolioRepository;
        this.portfolioStockRepository = portfolioStockRepository;
        this.stockService = stockService;
    }

    public PortfolioDto getPortfolio(String type) {
        Portfolio portfolio = portfolioRepository.findByType(type).orElseThrow(() ->
                new IllegalArgumentException("Portfolio not found: " + type));
        List<PortfolioStock> rows = portfolioStockRepository.findByPortfolio(portfolio);

        List<PositionDto> positions = rows.stream().map(ps -> {
            String region = ps.getStock().getExchange() != null && ps.getStock().getExchange().equalsIgnoreCase("NSE")
                    ? "india" : "us";
            StockDto quote = stockService.getStockData(region, ps.getStock().getSymbol());
            return PositionDto.builder()
                    .symbol(ps.getStock().getSymbol())
                    .exchange(ps.getStock().getExchange())
                    .currency(quote.getCurrency())
                    .quantity(ps.getQuantity())
                    .averagePrice(ps.getAveragePrice())
                    .currentPrice(quote.getCurrentPrice())
                    .build();
        }).toList();

        double total = positions.stream().mapToDouble(p -> p.getCurrentPrice() * p.getQuantity()).sum();
        return PortfolioDto.builder().type(type).positions(positions).totalValue(total).build();
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
    }
}
