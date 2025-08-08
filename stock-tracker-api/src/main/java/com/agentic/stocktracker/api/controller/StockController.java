package com.agentic.stocktracker.api.controller;

import com.agentic.stocktracker.api.dto.StockDto;
import com.agentic.stocktracker.api.service.StockService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stocks")
public class StockController {
    private final StockService stockService;
    public StockController(StockService stockService){ this.stockService = stockService; }

    @GetMapping("/{region}/{symbol}")
    public StockDto getStockData(@PathVariable String region, @PathVariable String symbol) {
        return stockService.getStockData(region, symbol);
    }
}
