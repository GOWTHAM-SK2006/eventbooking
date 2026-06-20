package com.eventbooking.repository;

import com.eventbooking.entity.Refund;
import com.eventbooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RefundRepository extends JpaRepository<Refund, UUID> {
    List<Refund> findByUserOrderByRequestedAtDesc(User user);
    List<Refund> findAllByOrderByRequestedAtDesc();
}
