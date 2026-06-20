package com.eventbooking.controller;

import com.eventbooking.dto.*;
import com.eventbooking.entity.User;
import com.eventbooking.security.UserDetailsImpl;
import com.eventbooking.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return ResponseEntity.ok(authService.registerUser(signUpRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.authenticateUser(loginRequest));
    }

    @PostMapping("/google")
    public ResponseEntity<JwtResponse> googleLogin(@Valid @RequestBody GoogleLoginRequest request) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<TokenRefreshResponse> refreshAccessToken(@Valid @RequestBody TokenRefreshRequest request) {
        return ResponseEntity.ok(authService.refreshAccessToken(request));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<MessageResponse> verifyEmail(@RequestParam String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = authService.getUserById(userDetails.getId());
        return ResponseEntity.ok(authService.mapToUserResponse(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<MessageResponse> updateUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                             @Valid @RequestBody UserProfileUpdate updateDto) {
        return ResponseEntity.ok(authService.updateUserProfile(userDetails.getId(), updateDto));
    }

    @PutMapping("/notification-settings")
    public ResponseEntity<MessageResponse> updateNotificationSettings(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody NotificationSettingsUpdate update) {
        return ResponseEntity.ok(authService.updateNotificationSettings(userDetails.getId(), update));
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers().stream()
                .map(authService::mapToUserResponse).toList());
    }

    @PutMapping("/users/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> blockUser(@PathVariable UUID id, @RequestParam boolean blocked) {
        return ResponseEntity.ok(authService.blockUser(id, blocked));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> deleteUser(@PathVariable UUID id) {
        return ResponseEntity.ok(authService.deleteUser(id));
    }

    @PutMapping("/users/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageResponse> updateRoles(@Valid @RequestBody RoleUpdateRequest request) {
        return ResponseEntity.ok(authService.updateUserRoles(request));
    }
}
