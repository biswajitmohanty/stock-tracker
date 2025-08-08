package com.agentic.stocktracker.api.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockDto {
    private String symbol;
    private String name;
    private String exchange;
    private String country;
    private String currency;
    private Double currentPrice;
    private String lastUpdatedAt;
}
