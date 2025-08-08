package com.agentic.stocktracker.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

@Configuration
public class FinnhubClientConfig {

    @Bean("finnhubClient")
    public WebClient finnhubClient(
            WebClient.Builder builder,
            @Value("${app.markets.finnhub-api-key}") String token
    ) {
        HttpClient httpClient = HttpClient.create()
                .wiretap(true); // request/response debugging

        return builder
                .baseUrl("https://finnhub.io/api/v1")
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .defaultHeader("X-Finnhub-Token", token.trim())
                .build();
    }
}
