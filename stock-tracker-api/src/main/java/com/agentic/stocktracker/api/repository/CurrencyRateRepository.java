package com.agentic.stocktracker.api.repository;

import com.agentic.stocktracker.api.entity.CurrencyRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CurrencyRateRepository extends JpaRepository<CurrencyRate, Long> {
    Optional<CurrencyRate> findByFromCurrencyAndToCurrency(String fromCurrency, String toCurrency);
}
