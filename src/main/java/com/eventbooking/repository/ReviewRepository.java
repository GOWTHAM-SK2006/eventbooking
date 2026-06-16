package com.eventbooking.repository;

import com.eventbooking.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByEventIdOrderByCreatedAtDesc(UUID eventId);
}
