package com.eventbooking.service;

import com.eventbooking.config.AppProperties;
import com.eventbooking.dto.*;
import com.eventbooking.entity.Role;
import com.eventbooking.entity.User;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.RoleRepository;
import com.eventbooking.repository.UserRepository;
import com.eventbooking.security.UserDetailsImpl;
import com.eventbooking.security.jwt.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;
    private final AppProperties appProperties;

    public AuthService(AuthenticationManager authenticationManager, UserRepository userRepository,
                       RoleRepository roleRepository, PasswordEncoder encoder, JwtUtils jwtUtils,
                       RefreshTokenService refreshTokenService, EmailService emailService,
                       AppProperties appProperties) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
        this.refreshTokenService = refreshTokenService;
        this.emailService = emailService;
        this.appProperties = appProperties;
    }

    @Transactional
    public MessageResponse registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .firstName(signUpRequest.getFirstName())
                .lastName(signUpRequest.getLastName())
                .phone(signUpRequest.getPhone())
                .verificationToken(verificationToken)
                .emailVerified(false)
                .build();

        Set<Role> roles = new HashSet<>();
        if (signUpRequest.getEmail().equalsIgnoreCase("admin@eventbooking.com")) {
            roles.add(roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_ADMIN not found")));
            user.setEmailVerified(true);
        } else {
            roles.add(roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_USER not found")));
        }

        user.setRoles(roles);
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), verificationToken, appProperties.getFrontendUrl());

        return new MessageResponse("User registered successfully! Please verify your email.");
    }

    @Transactional
    public MessageResponse verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));
        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
        return new MessageResponse("Email verified successfully!");
    }

    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("If the email exists, a reset link has been sent"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), token, appProperties.getFrontendUrl());
        return new MessageResponse("Password reset link sent to your email");
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Reset token has expired");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return new MessageResponse("Password reset successfully!");
    }

    @Transactional
    public JwtResponse googleLogin(GoogleLoginRequest request) {
        User user = userRepository.findByGoogleId(request.getGoogleId())
                .or(() -> userRepository.findByEmail(request.getEmail()))
                .orElse(null);

        if (user == null) {
            user = User.builder()
                    .email(request.getEmail())
                    .password(encoder.encode(UUID.randomUUID().toString()))
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .googleId(request.getGoogleId())
                    .profilePhotoUrl(request.getProfilePhotoUrl())
                    .emailVerified(true)
                    .build();
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_USER not found"));
            user.setRoles(Set.of(userRole));
            user = userRepository.save(user);
        } else {
            if (user.getGoogleId() == null) {
                user.setGoogleId(request.getGoogleId());
            }
            if (request.getProfilePhotoUrl() != null) {
                user.setProfilePhotoUrl(request.getProfilePhotoUrl());
            }
            user.setEmailVerified(true);
            user = userRepository.save(user);
        }

        if (user.isBlocked()) {
            throw new BadRequestException("Your account has been blocked");
        }

        return buildJwtResponse(user);
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (user.isBlocked()) {
            throw new BadRequestException("Your account has been blocked");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(userDetails);
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        var refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        return new JwtResponse(jwt, refreshToken.getToken(), userDetails.getId(),
                userDetails.getEmail(), userDetails.getFirstName(), userDetails.getLastName(), roles);
    }

    public TokenRefreshResponse refreshAccessToken(TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(token -> {
                    String accessToken = jwtUtils.generateTokenFromUsername(token.getUser().getEmail());
                    return new TokenRefreshResponse(accessToken, token.getToken());
                })
                .orElseThrow(() -> new BadRequestException("Refresh token is not in database!"));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }

    @Transactional
    public MessageResponse updateUserProfile(UUID id, UserProfileUpdate updateDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        if (updateDto.getFirstName() != null) user.setFirstName(updateDto.getFirstName());
        if (updateDto.getLastName() != null) user.setLastName(updateDto.getLastName());
        if (updateDto.getPhone() != null) user.setPhone(updateDto.getPhone());
        if (updateDto.getProfilePhotoUrl() != null) user.setProfilePhotoUrl(updateDto.getProfilePhotoUrl());

        if (updateDto.getNewPassword() != null && !updateDto.getNewPassword().trim().isEmpty()) {
            if (updateDto.getCurrentPassword() == null || !encoder.matches(updateDto.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Current password verification failed!");
            }
            user.setPassword(encoder.encode(updateDto.getNewPassword()));
        }

        userRepository.save(user);
        return new MessageResponse("Profile updated successfully!");
    }

    @Transactional
    public MessageResponse updateNotificationSettings(UUID id, NotificationSettingsUpdate update) {
        User user = getUserById(id);
        if (update.getNotificationEmail() != null) user.setNotificationEmail(update.getNotificationEmail());
        if (update.getNotificationPush() != null) user.setNotificationPush(update.getNotificationPush());
        if (update.getNotificationReminders() != null) user.setNotificationReminders(update.getNotificationReminders());
        userRepository.save(user);
        return new MessageResponse("Notification settings updated!");
    }

    @Transactional
    public MessageResponse blockUser(UUID userId, boolean blocked) {
        User user = getUserById(userId);
        user.setBlocked(blocked);
        userRepository.save(user);
        return new MessageResponse(blocked ? "User blocked" : "User unblocked");
    }

    @Transactional
    public MessageResponse deleteUser(UUID userId) {
        User user = getUserById(userId);
        userRepository.delete(user);
        return new MessageResponse("User deleted");
    }

    @Transactional
    public MessageResponse updateUserRoles(RoleUpdateRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Set<Role> roles = new HashSet<>();
        for (String roleName : request.getRoles()) {
            roles.add(roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName)));
        }
        user.setRoles(roles);
        userRepository.save(user);
        return new MessageResponse("Roles updated successfully");
    }

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phone(user.getPhone())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .emailVerified(user.isEmailVerified())
                .blocked(user.isBlocked())
                .notificationEmail(user.isNotificationEmail())
                .notificationPush(user.isNotificationPush())
                .notificationReminders(user.isNotificationReminders())
                .roles(user.getRoles().stream().map(Role::getName).toList())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private JwtResponse buildJwtResponse(User user) {
        String jwt = jwtUtils.generateTokenFromUsername(user.getEmail());
        var refreshToken = refreshTokenService.createRefreshToken(user.getId());
        List<String> roles = user.getRoles().stream().map(Role::getName).toList();
        return new JwtResponse(jwt, refreshToken.getToken(), user.getId(),
                user.getEmail(), user.getFirstName(), user.getLastName(), roles);
    }
}
