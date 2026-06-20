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
public class UserResponse {
    private UUID id;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String profilePhotoUrl;
    private boolean emailVerified;
    private boolean blocked;
    private boolean notificationEmail;
    private boolean notificationPush;
    private boolean notificationReminders;
    private List<String> roles;
    private LocalDateTime createdAt;
}
