package com.agentic.stocktracker.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "portfolios")
public class Portfolio {
    @Id @GeneratedValue
    private UUID portfolioId;

    private String name;
    /** "actual" or "hypothetical" */
    private String type;
    private LocalDateTime createdAt;
}
