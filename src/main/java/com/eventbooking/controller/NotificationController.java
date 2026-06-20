package com.eventbooking.controller;

import com.eventbooking.entity.Notification;
import com.eventbooking.entity.User;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.UserRepository;
import com.eventbooking.security.UserDetailsImpl;
import com.eventbooking.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final com.eventbooking.repository.BookingRepository bookingRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository,
                                  com.eventbooking.repository.BookingRepository bookingRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    public static class AnnouncementRequest {
        private String title;
        private String message;
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class ReminderRequest {
        private UUID eventId;
        private String title;
        private String message;
        public UUID getEventId() { return eventId; }
        public void setEventId(UUID eventId) { this.eventId = eventId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    @PostMapping("/announcement")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> sendAnnouncement(@RequestBody AnnouncementRequest request) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            notificationService.sendNotification(user, request.getTitle(), request.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reminder")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> sendReminder(@RequestBody ReminderRequest request) {
        List<com.eventbooking.entity.Booking> bookings = bookingRepository.findByEventId(request.getEventId());
        for (com.eventbooking.entity.Booking booking : bookings) {
            notificationService.sendNotification(booking.getUser(), request.getTitle(), request.getMessage());
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        List<Notification> notifications = notificationService.getUserNotifications(user);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id, @AuthenticationPrincipal UserDetailsImpl userDetails) {
        notificationService.markAsReadForUser(id, userDetails.getId());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationService.markAllAsRead(user);
        return ResponseEntity.noContent().build();
    }
}
