package com.agentic.stocktracker.api.config;

import com.agentic.stocktracker.api.entity.Portfolio;
import com.agentic.stocktracker.api.entity.PortfolioStock;
import com.agentic.stocktracker.api.entity.Stock;
import com.agentic.stocktracker.api.repository.PortfolioRepository;
import com.agentic.stocktracker.api.repository.PortfolioStockRepository;
import com.agentic.stocktracker.api.repository.StockRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner seedData(PortfolioRepository portfolioRepository,
                               PortfolioStockRepository portfolioStockRepository,
                               StockRepository stockRepository) {
        return args -> {
            Portfolio actual = portfolioRepository.findByType("actual")
                    .orElseGet(() -> portfolioRepository.save(Portfolio.builder()
                            .name("Actual Portfolio").type("actual").createdAt(LocalDateTime.now()).build()));

            Portfolio hypo = portfolioRepository.findByType("hypothetical")
                    .orElseGet(() -> portfolioRepository.save(Portfolio.builder()
                            .name("WhatIf").type("hypothetical").createdAt(LocalDateTime.now()).build()));

            if (portfolioStockRepository.findByPortfolio(actual).isEmpty()) {
                Stock aapl = stockRepository.findBySymbolAndExchange("AAPL", "NASDAQ")
                        .orElseGet(() -> stockRepository.save(Stock.builder()
                                .symbol("AAPL").name("Apple Inc.").exchange("NASDAQ")
                                .country("US").currency("USD").currentPrice(215.42)
                                .lastUpdatedAt(LocalDateTime.now()).build()));

                Stock infy = stockRepository.findBySymbolAndExchange("INFY", "NSE")
                        .orElseGet(() -> stockRepository.save(Stock.builder()
                                .symbol("INFY").name("Infosys Ltd").exchange("NSE")
                                .country("IN").currency("INR").currentPrice(1725.50)
                                .lastUpdatedAt(LocalDateTime.now()).build()));

                portfolioStockRepository.save(PortfolioStock.builder()
                        .portfolio(actual).stock(aapl).quantity(5).averagePrice(180.0).build());
                portfolioStockRepository.save(PortfolioStock.builder()
                        .portfolio(actual).stock(infy).quantity(10).averagePrice(1500.0).build());
            }
        };
    }
}
