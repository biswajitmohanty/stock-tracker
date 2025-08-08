package com.agentic.stocktracker.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class MarketApiConfig {

    @Bean("twelveDataClient")
    public WebClient twelveDataClient(
            WebClient.Builder builder
    ) {
        return builder
                .baseUrl("https://api.twelvedata.com")
                .defaultHeader("User-Agent", "stock-tracker-api/1.0")
                .build();
    }
}
