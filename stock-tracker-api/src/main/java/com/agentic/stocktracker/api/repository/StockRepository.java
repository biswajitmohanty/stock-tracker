package com.agentic.stocktracker.api.repository;

import com.agentic.stocktracker.api.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface StockRepository extends JpaRepository<Stock, UUID> {
    Optional<Stock> findBySymbolAndExchange(String symbol, String exchange);
}
