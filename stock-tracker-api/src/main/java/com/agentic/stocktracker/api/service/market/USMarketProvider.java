package com.agentic.stocktracker.api.service.market;

import com.agentic.stocktracker.api.dto.StockDto;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.OffsetDateTime;
import java.util.Map;

@org.springframework.core.annotation.Order(0)
@Service
public class USMarketProvider implements MarketDataProvider {

    private final WebClient finnhub;

    public USMarketProvider(@Qualifier("finnhubClient") WebClient finnhub) {
        this.finnhub = finnhub;
    }

    @Override
    public String region() {
        return "us";
    }

    @Override
    public StockDto getStock(String symbol) {
        if (symbol == null || symbol.isBlank()) {
            throw new IllegalArgumentException("symbol is required");
        }
        String s = symbol.trim().toUpperCase();

        Map<String, Object> quote = finnhub.get()
                .uri(uri -> uri.path("/quote").queryParam("symbol", s).build())
                .retrieve()
                .onStatus(sc -> sc.is4xxClientError() || sc.is5xxServerError(),
                        resp -> resp.bodyToMono(String.class)
                                .map(body -> new RuntimeException("Finnhub /quote error (" + s + "): " + body)))
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        double price = toDouble(quote.get("c"));     // current
        double prev  = toDouble(quote.get("pc"));    // previous close (fallback)
        if (price <= 0 && prev > 0) price = prev;

        return StockDto.builder()
                .symbol(s)
                .name("US: " + s)
                .exchange("NASDAQ") // or NYSE; you can refine later via profile lookup
                .country("US")
                .currency("USD")
                .currentPrice(price)
                .lastUpdatedAt(OffsetDateTime.now().toString())
                .build();
    }

    private static double toDouble(Object n) {
        if (n instanceof Number) return ((Number) n).doubleValue();
        try { return Double.parseDouble(String.valueOf(n)); } catch (Exception e) { return 0d; }
    }
}
