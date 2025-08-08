package com.agentic.stocktracker.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "portfolio_stocks")
public class PortfolioStock {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false)
    private Portfolio portfolio;

    @ManyToOne(optional=false)
    private Stock stock;

    private Integer quantity;
    private Double averagePrice;
    private Double soldPrice; // null if not sold
    private LocalDateTime soldDate; // null if not sold
}
