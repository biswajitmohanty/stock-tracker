package com.agentic.stocktracker.api.dto;

import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PortfolioDto {
    private String type;
    private double totalValue;
    private double totalCost;
    private double totalPl;
    private double totalPlPercent;
    private List<PositionDto> positions;
}
