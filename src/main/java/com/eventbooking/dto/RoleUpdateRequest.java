package com.eventbooking.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class RoleUpdateRequest {
    @NotBlank
    private String email;
    private List<String> roles;
}
