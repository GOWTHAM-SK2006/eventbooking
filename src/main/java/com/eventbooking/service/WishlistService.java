package com.eventbooking.service;

import com.eventbooking.dto.EventResponse;
import com.eventbooking.entity.Event;
import com.eventbooking.entity.User;
import com.eventbooking.entity.Wishlist;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.EventRepository;
import com.eventbooking.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class WishlistService {
    private final WishlistRepository wishlistRepository;
    private final EventRepository eventRepository;
    private final EventService eventService;

    public WishlistService(WishlistRepository wishlistRepository, EventRepository eventRepository,
                           EventService eventService) {
        this.wishlistRepository = wishlistRepository;
        this.eventRepository = eventRepository;
        this.eventService = eventService;
    }

    public List<EventResponse> getWishlist(User user) {
        return wishlistRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(w -> eventService.mapToResponse(w.getEvent()))
                .toList();
    }

    @Transactional
    public void addToWishlist(User user, UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        if (wishlistRepository.existsByUserAndEvent(user, event)) {
            throw new BadRequestException("Event already in wishlist");
        }
        wishlistRepository.save(Wishlist.builder().user(user).event(event).build());
    }

    @Transactional
    public void removeFromWishlist(User user, UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        Wishlist item = wishlistRepository.findByUserAndEvent(user, event)
                .orElseThrow(() -> new ResourceNotFoundException("Wishlist item not found"));
        wishlistRepository.delete(item);
    }

    public boolean isInWishlist(User user, UUID eventId) {
        return eventRepository.findById(eventId)
                .map(e -> wishlistRepository.existsByUserAndEvent(user, e))
                .orElse(false);
    }
}
