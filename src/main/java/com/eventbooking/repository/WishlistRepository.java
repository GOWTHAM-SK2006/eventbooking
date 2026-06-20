package com.eventbooking.repository;

import com.eventbooking.entity.Wishlist;
import com.eventbooking.entity.User;
import com.eventbooking.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WishlistRepository extends JpaRepository<Wishlist, UUID> {
    List<Wishlist> findByUserOrderByCreatedAtDesc(User user);
    Optional<Wishlist> findByUserAndEvent(User user, Event event);
    boolean existsByUserAndEvent(User user, Event event);
}
