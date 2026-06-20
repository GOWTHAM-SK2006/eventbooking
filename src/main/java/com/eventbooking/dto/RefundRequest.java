package com.eventbooking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class RefundRequest {
    @NotNull
    private UUID bookingId;
    private String reason;
}
