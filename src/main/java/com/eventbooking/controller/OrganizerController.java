package com.eventbooking.controller;

import com.eventbooking.dto.BookingResponse;
import com.eventbooking.dto.DashboardStatsResponse;
import com.eventbooking.dto.EventResponse;
import com.eventbooking.security.UserDetailsImpl;
import com.eventbooking.service.AnalyticsService;
import com.eventbooking.service.BookingService;
import com.eventbooking.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/organizer")
@PreAuthorize("hasRole('ADMIN')")
public class OrganizerController {

    private final EventService eventService;
    private final BookingService bookingService;
    private final AnalyticsService analyticsService;

    public OrganizerController(EventService eventService, BookingService bookingService,
                               AnalyticsService analyticsService) {
        this.eventService = eventService;
        this.bookingService = bookingService;
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboard(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(analyticsService.getOrganizerStats(user.getId()));
    }

    @GetMapping("/events")
    public ResponseEntity<List<EventResponse>> getMyEvents(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(eventService.getOrganizerEvents(user.getId()).stream()
                .map(eventService::mapToResponse).toList());
    }

    @GetMapping("/events/{eventId}/bookings")
    public ResponseEntity<List<BookingResponse>> getEventBookings(@PathVariable UUID eventId) {
        return ResponseEntity.ok(bookingService.getEventBookings(eventId));
    }

    @GetMapping("/events/{eventId}/attendees")
    public ResponseEntity<List<BookingResponse>> getAttendees(@PathVariable UUID eventId) {
        return ResponseEntity.ok(bookingService.getEventBookings(eventId).stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .toList());
    }
}
