package com.agentic.stocktracker.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "stocks", indexes = {
    @Index(name="idx_symbol_exchange", columnList = "symbol, exchange", unique = true)
})
public class Stock {
    @Id @GeneratedValue
    private UUID stockId;

    @Column(nullable=false)
    private String symbol;
    private String name;
    private String exchange;
    private String country;
    private String currency;
    private Double currentPrice;
    private LocalDateTime lastUpdatedAt;
}
