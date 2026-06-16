package com.eventbooking.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class EventRequest {
    @NotBlank
    private String title;

    private String description;

    private String location;

    @NotBlank
    private String category;

    @NotNull
    private LocalDateTime startDate;

    @NotNull
    private LocalDateTime endDate;

    @NotNull
    @DecimalMin(value = "0.0")
    private BigDecimal price;

    @NotNull
    @Min(value = 1)
    private Integer capacity;

    private String imageUrl;

    @NotBlank
    private String status; // DRAFT, PUBLISHED, CANCELLED
}
