package com.agentic.stocktracker.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name="currency_rates", indexes = {
    @Index(name="idx_from_to", columnList="fromCurrency,toCurrency", unique = true)
})
public class CurrencyRate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromCurrency;
    private String toCurrency;
    private Double rate;
    private LocalDateTime lastUpdated;
}
