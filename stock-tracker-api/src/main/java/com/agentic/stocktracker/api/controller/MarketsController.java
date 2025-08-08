package com.agentic.stocktracker.api.controller;

import com.agentic.stocktracker.api.dto.RegionDto;

import com.agentic.stocktracker.api.service.router.MarketRouterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
public class MarketsController {

    private final MarketRouterService router;

    public MarketsController(MarketRouterService router) {
        this.router = router;
    }

    @GetMapping("/regions")
    public List<RegionDto> regions() {
        return router.listRegions();
    }
}
