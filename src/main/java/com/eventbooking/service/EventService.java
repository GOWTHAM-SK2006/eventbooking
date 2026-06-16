package com.eventbooking.service;

import com.eventbooking.dto.EventRequest;
import com.eventbooking.entity.Event;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional
    public Event createEvent(EventRequest request) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .category(request.getCategory())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .price(request.getPrice())
                .capacity(request.getCapacity())
                .availableSlots(request.getCapacity())
                .imageUrl(request.getImageUrl())
                .status(request.getStatus())
                .build();

        return eventRepository.save(event);
    }

    @Transactional
    public Event updateEvent(UUID id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        // Handle capacity change. Can't decrease below booked seats.
        int bookedSlots = event.getCapacity() - event.getAvailableSlots();
        if (request.getCapacity() < bookedSlots) {
            throw new BadRequestException("Cannot reduce capacity below currently booked seats: " + bookedSlots);
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setLocation(request.getLocation());
        event.setCategory(request.getCategory());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setPrice(request.getPrice());
        event.setAvailableSlots(request.getCapacity() - bookedSlots);
        event.setCapacity(request.getCapacity());
        event.setImageUrl(request.getImageUrl());
        event.setStatus(request.getStatus());

        return eventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
        eventRepository.delete(event);
    }

    public Event getEventById(UUID id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));
    }

    public List<Event> getAllEvents(String category, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return eventRepository.searchEvents(search.trim());
        }
        if (category != null && !category.trim().isEmpty()) {
            return eventRepository.findByCategoryIgnoreCase(category.trim());
        }
        return eventRepository.findAll();
    }

    public List<Event> getFeaturedEvents() {
        return eventRepository.findByStartDateAfterAndStatusOrderByStartDateAsc(
                LocalDateTime.now(), "PUBLISHED"
        ).stream().limit(6).collect(Collectors.toList());
    }

    public List<Event> getTrendingEvents() {
        // Simple heuristic: return upcoming events ordered by start date (can be updated to sales metrics)
        return eventRepository.findByStartDateAfterAndStatusOrderByStartDateAsc(
                LocalDateTime.now(), "PUBLISHED"
        ).stream().limit(3).collect(Collectors.toList());
    }
}
