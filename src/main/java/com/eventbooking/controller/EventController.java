package com.eventbooking.controller;

import com.eventbooking.dto.EventRequest;
import com.eventbooking.dto.EventResponse;
import com.eventbooking.entity.Event;
import com.eventbooking.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .location(event.getLocation())
                .category(event.getCategory())
                .startDate(event.getStartDate())
                .endDate(event.getEndDate())
                .price(event.getPrice())
                .capacity(event.getCapacity())
                .availableSlots(event.getAvailableSlots())
                .imageUrl(event.getImageUrl())
                .status(event.getStatus())
                .build();
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        List<EventResponse> events = eventService.getAllEvents(category, search)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<EventResponse>> getFeaturedEvents() {
        List<EventResponse> events = eventService.getFeaturedEvents()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/trending")
    public ResponseEntity<List<EventResponse>> getTrendingEvents() {
        List<EventResponse> events = eventService.getTrendingEvents()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable UUID id) {
        Event event = eventService.getEventById(id);
        return ResponseEntity.ok(mapToResponse(event));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request) {
        Event event = eventService.createEvent(request);
        return ResponseEntity.ok(mapToResponse(event));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable UUID id, @Valid @RequestBody EventRequest request) {
        Event event = eventService.updateEvent(id, request);
        return ResponseEntity.ok(mapToResponse(event));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable UUID id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
