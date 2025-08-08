package com.agentic.stocktracker.api.service.router;

import com.agentic.stocktracker.api.dto.RegionDto;
import com.agentic.stocktracker.api.dto.StockDto;
import com.agentic.stocktracker.api.service.market.MarketDataProvider;
import org.springframework.core.annotation.AnnotationAwareOrderComparator;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MarketRouterService {

    private final Map<String, List<MarketDataProvider>> providersByRegion;
    private final Map<String, String> friendlyNames = Map.of(
            "us", "United States",
            "india", "India"
    );

    public MarketRouterService(List<MarketDataProvider> providers) {
        // group by region and sort by @Order (lower = higher priority)
        Map<String, List<MarketDataProvider>> grouped = providers.stream()
                .collect(Collectors.groupingBy(p -> p.region().toLowerCase(Locale.ROOT)));
        grouped.replaceAll((k, v) -> {
            v.sort(AnnotationAwareOrderComparator.INSTANCE);
            return v;
        });
        this.providersByRegion = Collections.unmodifiableMap(grouped);
    }

    public List<RegionDto> listRegions() {
        return providersByRegion.keySet().stream()
                .sorted()
                .map(id -> RegionDto.builder()
                        .id(id)
                        .name(friendlyNames.getOrDefault(id, id.substring(0,1).toUpperCase()+id.substring(1)))
                        .build())
                .toList();
    }

    public StockDto getQuoteWithFallback(String region, String symbol) {
        List<MarketDataProvider> chain = providersByRegion.get(region.toLowerCase(Locale.ROOT));
        if (chain == null || chain.isEmpty()) {
            throw new IllegalArgumentException("Unsupported region: " + region);
        }
        RuntimeException last = null;
        for (MarketDataProvider p : chain) {
            try {
                return p.getStock(symbol);
            } catch (RuntimeException ex) {
                last = ex;
                // try next provider in the chain
            }
        }
        throw new IllegalStateException("All providers failed for region=" + region + ", symbol=" + symbol,
                last);
    }
}
