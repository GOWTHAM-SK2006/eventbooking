package com.eventbooking.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class ReviewResponse {
    private UUID id;
    private UUID userId;
    private String userName;
    private UUID eventId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
