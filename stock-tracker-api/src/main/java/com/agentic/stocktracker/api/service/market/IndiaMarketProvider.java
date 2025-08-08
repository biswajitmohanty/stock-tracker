package com.agentic.stocktracker.api.service.market;

import com.agentic.stocktracker.api.dto.StockDto;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;

@Service
public class IndiaMarketProvider implements MarketDataProvider {
    @Override
    public StockDto getStock(String symbol) {
        double price = switch (symbol.toUpperCase()) {
            case "INFY" -> 1725.50;
            case "TCS" -> 4150.75;
            case "HDFCBANK" -> 1620.30;
            default -> 500.00;
        };
        return StockDto.builder()
                .symbol(symbol.toUpperCase())
                .name("Stub India Ltd")
                .exchange("NSE")
                .country("IN")
                .currency("INR")
                .currentPrice(price)
                .lastUpdatedAt(OffsetDateTime.now().toString())
                .build();
    }
    @Override
    public String region() { return "india"; }
}
