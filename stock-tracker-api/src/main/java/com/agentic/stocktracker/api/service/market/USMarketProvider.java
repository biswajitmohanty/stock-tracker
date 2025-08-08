package com.agentic.stocktracker.api.service.market;

import com.agentic.stocktracker.api.dto.StockDto;
import org.springframework.stereotype.Service;
import java.time.OffsetDateTime;

@Service
public class USMarketProvider implements MarketDataProvider {
    @Override
    public StockDto getStock(String symbol) {
        double price = switch (symbol.toUpperCase()) {
            case "AAPL" -> 215.42;
            case "TSLA" -> 248.11;
            case "MSFT" -> 435.09;
            default -> 100.00;
        };
        return StockDto.builder()
                .symbol(symbol.toUpperCase())
                .name("Stub US Corp")
                .exchange("NASDAQ")
                .country("US")
                .currency("USD")
                .currentPrice(price)
                .lastUpdatedAt(OffsetDateTime.now().toString())
                .build();
    }
    @Override
    public String region() { return "us"; }
}
