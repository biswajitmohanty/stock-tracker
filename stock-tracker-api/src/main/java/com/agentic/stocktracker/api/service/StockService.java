package com.agentic.stocktracker.api.service;

import com.agentic.stocktracker.api.dto.StockDto;
import com.agentic.stocktracker.api.service.router.MarketRouterService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class StockService {
    private final MarketRouterService router;

    public StockService(MarketRouterService router) {
        this.router = router;
    }

    @Cacheable(value = "stockQuotes", key = "#region + ':' + #symbol.toUpperCase()")
    public StockDto getStockData(String region, String symbol) {
        return router.getQuoteWithFallback(region, symbol);
    }
}
