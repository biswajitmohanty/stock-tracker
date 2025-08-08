package com.agentic.stocktracker.api.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PositionDto {
    private String symbol;
    private String exchange;
    private String currency;
    private int quantity;
    private double averagePrice;
    private double currentPrice;
}
