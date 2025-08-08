package com.agentic.stocktracker.api.service.market;

import com.agentic.stocktracker.api.dto.StockDto;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.OffsetDateTime;
import java.util.Map;

@org.springframework.core.annotation.Order(0)
@Service
public class IndiaMarketProvider implements MarketDataProvider {

    private final WebClient td;
    private final String apiKey;

    public IndiaMarketProvider(
            @Qualifier("twelveDataClient") WebClient td,
            @Value("${app.markets.twelvedata-api-key}") String apiKey
    ) {
        this.td = td;
        this.apiKey = apiKey;
    }

    @Override public String region() { return "india"; }

    @Override
    public StockDto getStock(String symbol) {
        String s = symbol.trim().toUpperCase();

        Map<String, Object> quote = td.get()
                .uri(uri -> uri.path("/quote")
                        .queryParam("symbol", s)
                        .queryParam("exchange", "NSE")
                        .queryParam("apikey", apiKey)
                        .build())
                .retrieve()
                .onStatus(sc -> sc.is4xxClientError() || sc.is5xxServerError(),
                        resp -> resp.bodyToMono(String.class)
                                .map(body -> new RuntimeException("TwelveData /quote error ("+s+"): " + body)))
                .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                .block();

        // Twelve Data sometimes returns "price", other times only "close"
        double price = pickPrice(quote);
        String name = String.valueOf(quote.getOrDefault("name", "NSE: " + s));
        String currency = String.valueOf(quote.getOrDefault("currency", "INR"));

        return StockDto.builder()
                .symbol(s)
                .name(name)
                .exchange("NSE")
                .country("IN")
                .currency(currency)
                .currentPrice(price)
                .lastUpdatedAt(OffsetDateTime.now().toString())
                .build();
    }

    private static double pickPrice(Map<String, Object> q) {
        double price = toDouble(q.get("price"));
        if (price <= 0) price = toDouble(q.get("close"));
        if (price <= 0) price = toDouble(q.get("previous_close"));
        return price;
    }

    private static double toDouble(Object n) {
        if (n instanceof Number) return ((Number)n).doubleValue();
        try { return Double.parseDouble(String.valueOf(n)); } catch (Exception e) { return 0d; }
    }
}
