package com.agentic.stocktracker.api.controller;

import com.agentic.stocktracker.api.dto.*;
import com.agentic.stocktracker.api.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/actual")
    public PortfolioDto actual() { return portfolioService.getPortfolio("actual"); }

    @GetMapping("/hypothetical")
    public PortfolioDto hypo() { return portfolioService.getPortfolio("hypothetical"); }

    @PostMapping("/{type}/positions")
    public ResponseEntity<?> addPosition(@PathVariable String type,
                                         @RequestBody AddPositionRequest req) {
        if (!type.equals("actual") && !type.equals("hypothetical"))
            return ResponseEntity.badRequest().body("type must be actual or hypothetical");
        portfolioService.addPosition(type, req);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @DeleteMapping("/{type}/positions")
    public ResponseEntity<?> removePosition(@PathVariable String type,
                                            @RequestBody Map<String, String> payload) {
        String symbol = payload.getOrDefault("symbol", "");
        String exchange = payload.get("exchange");
        if (symbol.isBlank()) return ResponseEntity.badRequest().body("symbol required");
        portfolioService.removePosition(type, symbol, exchange);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @PostMapping("/sell")
    public ResponseEntity<?> sell(@RequestBody SellPositionRequest req) {
        if (req.getSymbol() == null || req.getSymbol().isBlank())
            return ResponseEntity.badRequest().body("symbol required");
        portfolioService.sellPosition(req);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @PostMapping("/move-to-hypothetical")
    public ResponseEntity<?> move(@RequestBody Map<String, String> payload) {
        String symbol = payload.getOrDefault("symbol", "");
        String exchange = payload.get("exchange");
        if (symbol.isBlank()) return ResponseEntity.badRequest().body("symbol required");
        portfolioService.moveToHypothetical(symbol, exchange);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/history")
    public List<TradeHistoryDto> history() {
        return portfolioService.getTradeHistory();
    }
}
