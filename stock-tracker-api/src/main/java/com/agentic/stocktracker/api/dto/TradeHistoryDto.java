package com.agentic.stocktracker.api.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TradeHistoryDto {
    private Long id;
    private String symbol;
    private String stockName;
    private String exchange;
    private String currency;
    private String tradeType;
    private Integer quantity;
    private Double price;
    private Double totalValue;
    private String portfolioType;
    private String tradeDate;
    private String notes;
}
