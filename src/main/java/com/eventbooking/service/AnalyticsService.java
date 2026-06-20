package com.eventbooking.service;

import com.eventbooking.dto.BookingResponse;
import com.eventbooking.dto.DashboardStatsResponse;
import com.eventbooking.entity.Booking;
import com.eventbooking.repository.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;

    public AnalyticsService(EventRepository eventRepository, BookingRepository bookingRepository,
                            UserRepository userRepository, PaymentRepository paymentRepository,
                            TicketRepository ticketRepository) {
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.ticketRepository = ticketRepository;
    }

    public DashboardStatsResponse getDashboardStats() {
        long totalEvents = eventRepository.count();
        long totalUsers = userRepository.count();
        List<Booking> allBookings = bookingRepository.findAll();

        long totalBookings = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .count();

        BigDecimal totalRevenue = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Map recent bookings
        List<BookingResponse> recentBookings = allBookings.stream()
                .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
                .limit(5)
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        // Category sales mapping
        Map<String, Long> categorySales = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .collect(Collectors.groupingBy(
                        b -> b.getEvent().getCategory() != null ? b.getEvent().getCategory() : "Other",
                        Collectors.summingLong(Booking::getQuantity)
                ));

        // Monthly revenue mapping (Format: YYYY-MM)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, BigDecimal> monthlyRevenue = allBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .collect(Collectors.groupingBy(
                        b -> b.getBookingDate().format(formatter),
                        TreeMap::new,
                        Collectors.mapping(Booking::getTotalPrice, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        return DashboardStatsResponse.builder()
                .totalEvents(totalEvents)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .totalUsers(totalUsers)
                .recentBookings(recentBookings)
                .categorySales(categorySales)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }

    public DashboardStatsResponse getOrganizerStats(UUID organizerId) {
        List<com.eventbooking.entity.Event> organizerEvents = eventRepository.findByOrganizerId(organizerId);
        List<UUID> eventIds = organizerEvents.stream().map(com.eventbooking.entity.Event::getId).toList();

        List<Booking> organizerBookings = bookingRepository.findAll().stream()
                .filter(b -> eventIds.contains(b.getEvent().getId()))
                .toList();

        long totalBookings = organizerBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .count();

        BigDecimal totalRevenue = organizerBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .map(Booking::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<BookingResponse> recentBookings = organizerBookings.stream()
                .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
                .limit(5)
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        Map<String, Long> categorySales = organizerBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .collect(Collectors.groupingBy(
                        b -> b.getEvent().getCategory() != null ? b.getEvent().getCategory() : "Other",
                        Collectors.summingLong(Booking::getQuantity)
                ));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        Map<String, BigDecimal> monthlyRevenue = organizerBookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getStatus()))
                .collect(Collectors.groupingBy(
                        b -> b.getBookingDate().format(formatter),
                        TreeMap::new,
                        Collectors.mapping(Booking::getTotalPrice, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        return DashboardStatsResponse.builder()
                .totalEvents(organizerEvents.size())
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue)
                .totalUsers(0)
                .recentBookings(recentBookings)
                .categorySales(categorySales)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }

    private BookingResponse mapToResponse(Booking booking) {
        List<String> codes = ticketRepository.findByBookingId(booking.getId()).stream()
                .map(t -> t.getTicketCode())
                .collect(Collectors.toList());
        String transactionId = paymentRepository.findByBookingId(booking.getId())
                .map(p -> p.getTransactionId())
                .orElse(null);

        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userEmail(booking.getUser().getEmail())
                .eventId(booking.getEvent().getId())
                .eventTitle(booking.getEvent().getTitle())
                .eventDate(booking.getEvent().getStartDate())
                .eventPrice(booking.getEvent().getPrice())
                .quantity(booking.getQuantity())
                .totalPrice(booking.getTotalPrice())
                .status(booking.getStatus())
                .bookingDate(booking.getBookingDate())
                .ticketCodes(codes)
                .transactionId(transactionId)
                .build();
    }
}
