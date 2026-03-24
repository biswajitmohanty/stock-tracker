package com.agentic.stocktracker.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Table(name = "trade_history")
public class TradeHistory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String symbol;
    private String stockName;
    private String exchange;
    private String currency;

    /** BUY, SELL, MOVE_OUT, MOVE_IN */
    private String tradeType;

    private Integer quantity;
    private Double price;
    private Double totalValue;
    private String portfolioType;
    private LocalDateTime tradeDate;
    private String notes;
}
