package com.agentic.stocktracker.api.repository;

import com.agentic.stocktracker.api.entity.Portfolio;
import com.agentic.stocktracker.api.entity.PortfolioStock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioStockRepository extends JpaRepository<PortfolioStock, Long> {
    List<PortfolioStock> findByPortfolio(Portfolio portfolio);
}
