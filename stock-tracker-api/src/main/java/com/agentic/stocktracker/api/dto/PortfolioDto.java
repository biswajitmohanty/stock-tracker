package com.agentic.stocktracker.api.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PortfolioDto {
    private String type; // actual or hypothetical
    private double totalValue;
    private List<PositionDto> positions;
}
