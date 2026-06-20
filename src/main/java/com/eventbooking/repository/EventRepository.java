package com.eventbooking.repository;

import com.eventbooking.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID>, JpaSpecificationExecutor<Event> {
    List<Event> findByCategoryIgnoreCase(String category);
    
    @Query("SELECT e FROM Event e WHERE LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Event> searchEvents(@Param("query") String query);
    
    List<Event> findByStartDateAfterAndStatusOrderByStartDateAsc(LocalDateTime now, String status);

    List<Event> findByFeaturedTrueAndStatusAndStartDateAfterOrderByStartDateAsc(String status, LocalDateTime now);

    List<Event> findByOrganizerId(UUID organizerId);

    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND e.startDate > :now ORDER BY e.bookingCount DESC")
    List<Event> findTrendingByBookingCount(@Param("now") LocalDateTime now);

    @Query("SELECT e FROM Event e WHERE e.status = 'PUBLISHED' AND e.startDate > CURRENT_TIMESTAMP " +
           "AND (:minPrice IS NULL OR e.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR e.price <= :maxPrice) " +
           "AND (:category IS NULL OR LOWER(e.category) = LOWER(:category)) " +
           "AND (:location IS NULL OR LOWER(e.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:startDate IS NULL OR e.startDate >= :startDate) " +
           "AND (:endDate IS NULL OR e.startDate <= :endDate) " +
           "ORDER BY e.startDate ASC")
    List<Event> filterEvents(@Param("minPrice") java.math.BigDecimal minPrice,
                             @Param("maxPrice") java.math.BigDecimal maxPrice,
                             @Param("category") String category,
                             @Param("location") String location,
                             @Param("startDate") LocalDateTime startDate,
                             @Param("endDate") LocalDateTime endDate);

    long countByDeletedFalse();
}
