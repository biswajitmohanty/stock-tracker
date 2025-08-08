package com.agentic.stocktracker.api.repository;

import com.agentic.stocktracker.api.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PortfolioRepository extends JpaRepository<Portfolio, UUID> {
    Optional<Portfolio> findByType(String type);
    Optional<Portfolio> findByName(String name);
}
