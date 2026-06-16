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
public class BookingResponse {
    private UUID id;
    private UUID userId;
    private String userEmail;
    private UUID eventId;
    private String eventTitle;
    private LocalDateTime eventDate;
    private BigDecimal eventPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
    private String status;
    private LocalDateTime bookingDate;
    private List<String> ticketCodes;
    private String transactionId;
}
