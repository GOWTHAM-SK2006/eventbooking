package com.eventbooking.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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
    private UUID organizerId;
    private String venueName;
    private String venueAddress;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private List<String> galleryImages;
    private Boolean featured;
    private String faqs;
    private String termsConditions;
    private String schedule;
    private Boolean seatSelectionEnabled;

    @NotBlank
    private String status;
}