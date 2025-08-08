package com.agentic.stocktracker.api.service.market;

import com.agentic.stocktracker.api.dto.StockDto;

public interface MarketDataProvider {
    StockDto getStock(String symbol);
    String region(); // e.g., "us", "india"
}
