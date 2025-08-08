package com.agentic.stocktracker.api.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegionDto {
    /** region id used in URLs, e.g. "us", "india" */
    private String id;
    /** human friendly name, e.g. "United States", "India" */
    private String name;
}
