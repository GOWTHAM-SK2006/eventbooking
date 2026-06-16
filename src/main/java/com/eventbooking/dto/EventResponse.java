package com.eventbooking.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class EventResponse {
    private UUID id;
    private String title;
    private String description;
    private String location;
    private String category;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal price;
    private Integer capacity;
    private Integer availableSlots;
    private String imageUrl;
    private String status;
}
