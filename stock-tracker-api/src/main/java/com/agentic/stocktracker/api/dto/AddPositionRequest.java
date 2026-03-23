package com.agentic.stocktracker.api.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AddPositionRequest {
    private String symbol;
    private String exchange;  // NASDAQ, NYSE, NSE
    private String region;    // us, india
    private Integer quantity;
    private Double averagePrice;
}
