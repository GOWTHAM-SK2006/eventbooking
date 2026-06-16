package com.eventbooking.repository;

import com.eventbooking.entity.Booking;
import com.eventbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUserOrderByBookingDateDesc(User user);
    List<Booking> findByEventId(UUID eventId);
}
