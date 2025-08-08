package com.agentic.stocktracker.api.controller;

import com.agentic.stocktracker.api.dto.PortfolioDto;
import com.agentic.stocktracker.api.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;
    public PortfolioController(PortfolioService portfolioService) { this.portfolioService = portfolioService; }

    @GetMapping("/actual")
    public PortfolioDto actual() { return portfolioService.getPortfolio("actual"); }

    @GetMapping("/hypothetical")
    public PortfolioDto hypo() { return portfolioService.getPortfolio("hypothetical"); }

    @PostMapping("/move-to-hypothetical")
    public ResponseEntity<?> move(@RequestBody Map<String, String> payload) {
        String symbol = payload.getOrDefault("symbol", "");
        String exchange = payload.get("exchange");
        if (symbol.isBlank()) return ResponseEntity.badRequest().body("symbol required");
        portfolioService.moveToHypothetical(symbol, exchange);
        return ResponseEntity.ok(Map.of("status","ok"));
    }
}
