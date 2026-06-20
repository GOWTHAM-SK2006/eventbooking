package com.eventbooking.controller;

import com.eventbooking.dto.EventRequest;
import com.eventbooking.dto.EventResponse;
import com.eventbooking.entity.Event;
import com.eventbooking.entity.EventSeat;
import com.eventbooking.entity.User;
import com.eventbooking.security.UserDetailsImpl;
import com.eventbooking.service.EventSeatService;
import com.eventbooking.service.EventService;
import com.eventbooking.service.EventViewService;
import com.eventbooking.service.WishlistService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final EventViewService eventViewService;
    private final WishlistService wishlistService;
    private final EventSeatService eventSeatService;

    public EventController(EventService eventService, EventViewService eventViewService,
                           WishlistService wishlistService, EventSeatService eventSeatService) {
        this.eventService = eventService;
        this.eventViewService = eventViewService;
        this.wishlistService = wishlistService;
        this.eventSeatService = eventSeatService;
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        List<Event> events;
        if (minPrice != null || maxPrice != null || location != null || startDate != null || endDate != null) {
            LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate) : null;
            LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate) : null;
            events = eventService.filterEvents(minPrice, maxPrice, category, location, start, end);
        } else {
            events = eventService.getAllEvents(category, search);
        }

        return ResponseEntity.ok(events.stream().map(eventService::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/featured")
    public ResponseEntity<List<EventResponse>> getFeaturedEvents() {
        return ResponseEntity.ok(eventService.getFeaturedEvents().stream()
                .map(eventService::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<EventResponse>> getTrendingEvents() {
        return ResponseEntity.ok(eventService.getTrendingEvents().stream()
                .map(eventService::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponse>> getUpcomingEvents() {
        return ResponseEntity.ok(eventService.getUpcomingEvents().stream()
                .map(eventService::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/recommended")
    public ResponseEntity<List<EventResponse>> getRecommendedEvents(@AuthenticationPrincipal UserDetailsImpl user) {
        User u = user != null ? User.builder().id(user.getId()).build() : null;
        return ResponseEntity.ok(eventService.getRecommendedEvents(u).stream()
                .map(eventService::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<EventResponse>> getNearbyEvents(
            @RequestParam(required = false) BigDecimal lat,
            @RequestParam(required = false) BigDecimal lng) {
        return ResponseEntity.ok(eventService.getNearbyEvents(lat, lng).stream()
                .map(eventService::mapToResponse).collect(Collectors.toList()));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<EventResponse>> getRecentlyViewed(@AuthenticationPrincipal UserDetailsImpl user) {
        if (user == null) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(eventViewService.getRecentlyViewed(User.builder().id(user.getId()).build()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable UUID id,
                                                      @AuthenticationPrincipal UserDetailsImpl user) {
        Event event = eventService.getEventById(id);
        if (user != null) {
            eventViewService.recordView(User.builder().id(user.getId()).build(), id);
        }
        return ResponseEntity.ok(eventService.mapToResponse(event));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<List<Map<String, String>>> getEventSeats(@PathVariable UUID id) {
        Event event = eventService.getEventById(id);
        List<EventSeat> seats = eventSeatService.getAllSeats(event);
        return ResponseEntity.ok(seats.stream()
                .map(s -> Map.of("label", s.getSeatLabel(), "status", s.getStatus()))
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}/wishlist")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(@PathVariable UUID id,
                                                               @AuthenticationPrincipal UserDetailsImpl user) {
        boolean inWishlist = wishlistService.isInWishlist(User.builder().id(user.getId()).build(), id);
        return ResponseEntity.ok(Map.of("inWishlist", inWishlist));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request,
                                                     @AuthenticationPrincipal UserDetailsImpl user) {
        User currentUser = User.builder().id(user.getId()).build();
        Event event = eventService.createEvent(request, currentUser);
        return ResponseEntity.ok(eventService.mapToResponse(event));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable UUID id, @Valid @RequestBody EventRequest request) {
        Event event = eventService.updateEvent(id, request);
        return ResponseEntity.ok(eventService.mapToResponse(event));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
