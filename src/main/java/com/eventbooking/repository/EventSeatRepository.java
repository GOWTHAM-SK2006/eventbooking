package com.eventbooking.repository;

import com.eventbooking.entity.EventSeat;
import com.eventbooking.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface EventSeatRepository extends JpaRepository<EventSeat, UUID> {
    List<EventSeat> findByEvent(Event event);
    List<EventSeat> findByEventAndStatus(Event event, String status);
}
