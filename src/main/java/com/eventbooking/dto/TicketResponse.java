package com.eventbooking.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class TicketResponse {
    private UUID id;
    private String ticketCode;
    private String status;
    private String seatLabel;
    private String qrData;
    private String qrImageBase64;
    private LocalDateTime checkedInAt;
    private UUID bookingId;
    private String eventTitle;
    private LocalDateTime eventDate;
    private String userName;
}
