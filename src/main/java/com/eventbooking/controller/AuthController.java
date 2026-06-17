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

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        MessageResponse response = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refreshtoken")
    public ResponseEntity<TokenRefreshResponse> refreshAccessToken(@Valid @RequestBody TokenRefreshRequest request) {
        TokenRefreshResponse response = authService.refreshAccessToken(request);
        return ResponseEntity.ok(response);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .roles(user.getRoles().stream().map(r -> r.getName()).toList())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = authService.getUserById(userDetails.getId());
        return ResponseEntity.ok(mapToUserResponse(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<MessageResponse> updateUserProfile(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                                             @Valid @RequestBody UserProfileUpdate updateDto) {
        MessageResponse response = authService.updateUserProfile(userDetails.getId(), updateDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = authService.getAllUsers().stream()
                .map(this::mapToUserResponse).toList();
        return ResponseEntity.ok(users);
    }
}
