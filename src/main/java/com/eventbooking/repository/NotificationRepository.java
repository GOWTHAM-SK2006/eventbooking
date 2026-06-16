package com.eventbooking.repository;

import com.eventbooking.entity.Notification;
import com.eventbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findByUserAndReadOrderByCreatedAtDesc(User user, boolean read);
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
}
