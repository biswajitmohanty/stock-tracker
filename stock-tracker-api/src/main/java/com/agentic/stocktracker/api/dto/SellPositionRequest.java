package com.agentic.stocktracker.api.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SellPositionRequest {
    private String symbol;
    private String exchange;
    private Integer quantity;  // how many shares to sell (null = sell all)
    private Double sellPrice;  // price at which sold
}
