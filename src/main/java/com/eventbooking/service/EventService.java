package com.eventbooking.service;

import com.eventbooking.dto.EventRequest;
import com.eventbooking.dto.EventResponse;
import com.eventbooking.entity.Event;
import com.eventbooking.entity.User;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.EventRepository;
import com.eventbooking.repository.ReviewRepository;
import com.eventbooking.repository.UserRepository;
import com.eventbooking.util.JsonUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final EventSeatService eventSeatService;

    public EventService(EventRepository eventRepository, UserRepository userRepository,
                        ReviewRepository reviewRepository, EventSeatService eventSeatService) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.eventSeatService = eventSeatService;
    }

    @Transactional
    public Event createEvent(EventRequest request, User currentUser) {
        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

        User organizer = resolveOrganizer(request.getOrganizerId(), currentUser);

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
                .organizer(organizer)
                .venueName(request.getVenueName())
                .venueAddress(request.getVenueAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .galleryImages(JsonUtils.toJson(request.getGalleryImages()))
                .featured(Boolean.TRUE.equals(request.getFeatured()))
                .faqs(request.getFaqs())
                .termsConditions(request.getTermsConditions())
                .schedule(request.getSchedule())
                .seatSelectionEnabled(Boolean.TRUE.equals(request.getSeatSelectionEnabled()))
                .build();

        event = eventRepository.save(event);
        if (event.isSeatSelectionEnabled()) {
            eventSeatService.generateSeats(event);
        }
        return event;
    }

    @Transactional
    public Event updateEvent(UUID id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + id));

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date cannot be after end date");
        }

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
        event.setVenueName(request.getVenueName());
        event.setVenueAddress(request.getVenueAddress());
        event.setLatitude(request.getLatitude());
        event.setLongitude(request.getLongitude());
        event.setGalleryImages(JsonUtils.toJson(request.getGalleryImages()));
        if (request.getFeatured() != null) event.setFeatured(request.getFeatured());
        event.setFaqs(request.getFaqs());
        event.setTermsConditions(request.getTermsConditions());
        event.setSchedule(request.getSchedule());
        if (request.getSeatSelectionEnabled() != null) {
            event.setSeatSelectionEnabled(request.getSeatSelectionEnabled());
        }

        if (request.getOrganizerId() != null) {
            event.setOrganizer(userRepository.findById(request.getOrganizerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Organizer not found")));
        }

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

    public List<Event> filterEvents(BigDecimal minPrice, BigDecimal maxPrice, String category,
                                    String location, LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.filterEvents(minPrice, maxPrice, category, location, startDate, endDate);
    }

    public List<Event> getFeaturedEvents() {
        List<Event> featured = eventRepository.findByFeaturedTrueAndStatusAndStartDateAfterOrderByStartDateAsc(
                "PUBLISHED", LocalDateTime.now());
        if (!featured.isEmpty()) return featured.stream().limit(6).toList();
        return eventRepository.findByStartDateAfterAndStatusOrderByStartDateAsc(
                LocalDateTime.now(), "PUBLISHED").stream().limit(6).toList();
    }

    public List<Event> getTrendingEvents() {
        return eventRepository.findTrendingByBookingCount(LocalDateTime.now()).stream().limit(6).toList();
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findByStartDateAfterAndStatusOrderByStartDateAsc(
                LocalDateTime.now(), "PUBLISHED");
    }

    public List<Event> getRecommendedEvents(User user) {
        return eventRepository.findByStartDateAfterAndStatusOrderByStartDateAsc(
                LocalDateTime.now(), "PUBLISHED").stream().limit(6).toList();
    }

    public List<Event> getNearbyEvents(BigDecimal lat, BigDecimal lng) {
        return eventRepository.findByStartDateAfterAndStatusOrderByStartDateAsc(
                LocalDateTime.now(), "PUBLISHED").stream()
                .filter(e -> e.getLatitude() != null && e.getLongitude() != null)
                .limit(6)
                .toList();
    }

    public List<Event> getOrganizerEvents(UUID organizerId) {
        return eventRepository.findByOrganizerId(organizerId);
    }

    @Transactional
    public void incrementBookingCount(Event event) {
        event.setBookingCount(event.getBookingCount() + 1);
        eventRepository.save(event);
    }

    public EventResponse mapToResponse(Event event) {
        Double avgRating = reviewRepository.findByEventIdOrderByCreatedAtDesc(event.getId()).stream()
                .mapToInt(r -> r.getRating())
                .average()
                .orElse(0.0);
        long reviewCount = reviewRepository.findByEventIdOrderByCreatedAtDesc(event.getId()).size();

        String organizerName = null;
        UUID organizerId = null;
        if (event.getOrganizer() != null) {
            organizerId = event.getOrganizer().getId();
            organizerName = (event.getOrganizer().getFirstName() != null ? event.getOrganizer().getFirstName() : "")
                    + " " + (event.getOrganizer().getLastName() != null ? event.getOrganizer().getLastName() : "");
            organizerName = organizerName.trim();
        }

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
                .organizerId(organizerId)
                .organizerName(organizerName.isBlank() ? "Event Organizer" : organizerName)
                .venueName(event.getVenueName())
                .venueAddress(event.getVenueAddress())
                .latitude(event.getLatitude())
                .longitude(event.getLongitude())
                .galleryImages(JsonUtils.fromJson(event.getGalleryImages()))
                .featured(event.isFeatured())
                .faqs(event.getFaqs())
                .termsConditions(event.getTermsConditions())
                .schedule(event.getSchedule())
                .bookingCount(event.getBookingCount())
                .seatSelectionEnabled(event.isSeatSelectionEnabled())
                .averageRating(avgRating)
                .reviewCount(reviewCount)
                .build();
    }

    private User resolveOrganizer(UUID organizerId, User currentUser) {
        if (organizerId != null) {
            return userRepository.findById(organizerId)
                    .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));
        }
        return currentUser;
    }
}
