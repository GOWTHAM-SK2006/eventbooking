package com.eventbooking.service;

import com.eventbooking.entity.Event;
import com.eventbooking.entity.EventView;
import com.eventbooking.entity.User;
import com.eventbooking.repository.EventRepository;
import com.eventbooking.repository.EventViewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service
public class EventViewService {
    private final EventViewRepository eventViewRepository;
    private final EventRepository eventRepository;
    private final EventService eventService;

    public EventViewService(EventViewRepository eventViewRepository, EventRepository eventRepository,
                            EventService eventService) {
        this.eventViewRepository = eventViewRepository;
        this.eventRepository = eventRepository;
        this.eventService = eventService;
    }

    @Transactional
    public void recordView(User user, UUID eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event == null || user == null) return;

        eventViewRepository.findByUserAndEvent(user, event).ifPresentOrElse(
                view -> {
                    view.setViewedAt(java.time.LocalDateTime.now());
                    eventViewRepository.save(view);
                },
                () -> eventViewRepository.save(EventView.builder().user(user).event(event).build())
        );
    }

    public List<com.eventbooking.dto.EventResponse> getRecentlyViewed(User user) {
        return eventViewRepository.findRecentByUser(user).stream()
                .limit(10)
                .map(v -> eventService.mapToResponse(v.getEvent()))
                .toList();
    }
}
