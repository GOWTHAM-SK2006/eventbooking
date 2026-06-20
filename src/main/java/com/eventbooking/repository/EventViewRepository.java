package com.eventbooking.repository;

import com.eventbooking.entity.EventView;
import com.eventbooking.entity.User;
import com.eventbooking.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventViewRepository extends JpaRepository<EventView, UUID> {
    @Query("SELECT ev FROM EventView ev WHERE ev.user = :user ORDER BY ev.viewedAt DESC")
    List<EventView> findRecentByUser(User user);

    Optional<EventView> findByUserAndEvent(User user, Event event);
}
