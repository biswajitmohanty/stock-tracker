package com.agentic.stocktracker.api.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PositionDto {
    private Long positionId;
    private String symbol;
    private String name;
    private String exchange;
    private String currency;
    private int quantity;
    private double averagePrice;
    private double currentPrice;
    private double pl;
    private double plPercent;
    private double marketValue;
}
