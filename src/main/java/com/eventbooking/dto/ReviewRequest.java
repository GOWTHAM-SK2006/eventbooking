package com.eventbooking.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class ReviewRequest {
    @NotNull
    private UUID eventId;

    @NotNull
    @Min(value = 1)
    @Max(value = 5)
    private Integer rating;

    @NotBlank
    private String comment;
}
