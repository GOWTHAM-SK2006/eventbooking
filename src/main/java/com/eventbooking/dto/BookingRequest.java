package com.eventbooking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class BookingRequest {
    @NotNull
    private UUID eventId;

    @NotNull
    @Min(value = 1)
    private Integer quantity;

    @NotNull
    private String paymentMethod;

    private String couponCode;
    private List<String> selectedSeats;
    private String razorpayPaymentId;
    private String razorpayOrderId;
    private String razorpaySignature;
}
