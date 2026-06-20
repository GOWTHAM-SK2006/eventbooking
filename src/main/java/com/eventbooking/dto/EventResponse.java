package com.eventbooking.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
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
    private UUID organizerId;
    private String organizerName;
    private String venueName;
    private String venueAddress;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private List<String> galleryImages;
    private boolean featured;
    private String faqs;
    private String termsConditions;
    private String schedule;
    private Integer bookingCount;
    private boolean seatSelectionEnabled;
    private Double averageRating;
    private Long reviewCount;
}
