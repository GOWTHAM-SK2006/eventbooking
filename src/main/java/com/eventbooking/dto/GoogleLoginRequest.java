package com.eventbooking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleLoginRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String googleId;

    private String firstName;
    private String lastName;
    private String profilePhotoUrl;
}
