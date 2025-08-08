package com.agentic.stocktracker.api.service;

import com.agentic.stocktracker.api.dto.StockDto;
import com.agentic.stocktracker.api.service.market.MarketDataProvider;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StockService {
    private final Map<String, MarketDataProvider> providers;

    public StockService(java.util.List<MarketDataProvider> providers) {
        this.providers = providers.stream().collect(Collectors.toMap(MarketDataProvider::region, p -> p));
    }

    public StockDto getStockData(String region, String symbol) {
        MarketDataProvider provider = providers.get(region.toLowerCase());
        if (provider == null) throw new IllegalArgumentException("Unsupported region: " + region);
        return provider.getStock(symbol);
    }
}
