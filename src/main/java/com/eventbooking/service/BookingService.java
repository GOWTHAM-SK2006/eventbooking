package com.eventbooking.service;

import com.eventbooking.dto.BookingRequest;
import com.eventbooking.dto.BookingResponse;
import com.eventbooking.entity.*;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;
    private final PaymentService paymentService;
    private final TicketService ticketService;
    private final NotificationService notificationService;
    private final PaymentRepository paymentRepository;
    private final TicketRepository ticketRepository;

    public BookingService(BookingRepository bookingRepository, EventRepository eventRepository,
                          PaymentService paymentService, TicketService ticketService,
                          NotificationService notificationService, PaymentRepository paymentRepository,
                          TicketRepository ticketRepository) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.paymentService = paymentService;
        this.ticketService = ticketService;
        this.notificationService = notificationService;
        this.paymentRepository = paymentRepository;
        this.ticketRepository = ticketRepository;
    }

    @Transactional
    public BookingResponse createBooking(BookingRequest request, User user) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with ID: " + request.getEventId()));

        if (!"PUBLISHED".equals(event.getStatus())) {
            throw new BadRequestException("This event is not open for booking");
        }

        if (LocalDateTime.now().isAfter(event.getStartDate())) {
            throw new BadRequestException("Cannot book slots. The event has already started");
        }

        if (event.getAvailableSlots() < request.getQuantity()) {
            throw new BadRequestException("Not enough available tickets. Remaining slots: " + event.getAvailableSlots());
        }

        // Deduct slots
        event.setAvailableSlots(event.getAvailableSlots() - request.getQuantity());
        eventRepository.save(event);

        BigDecimal total = event.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));

        // Create Booking (PENDING state)
        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .quantity(request.getQuantity())
                .totalPrice(total)
                .status("PENDING")
                .build();
        booking = bookingRepository.save(booking);

        // Process Payment (Saves payment & marks COMPLETED)
        Payment payment = paymentService.processPayment(booking, request.getPaymentMethod());

        // Update Booking (CONFIRMED)
        booking.setStatus("CONFIRMED");
        booking = bookingRepository.save(booking);

        // Generate Tickets
        List<Ticket> tickets = ticketService.generateTickets(booking);
        List<String> ticketCodes = tickets.stream().map(Ticket::getTicketCode).collect(Collectors.toList());

        // Notify user
        notificationService.sendNotification(user, "Booking Confirmed!", 
                "Successfully booked " + request.getQuantity() + " slot(s) for event: " + event.getTitle());

        return mapToResponse(booking, ticketCodes, payment.getTransactionId());
    }

    @Transactional
    public void cancelBooking(UUID bookingId, User user, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized to cancel this booking");
        }

        if ("CANCELLED".equals(booking.getStatus())) {
            throw new BadRequestException("Booking is already cancelled");
        }

        // Cancel tickets
        List<Ticket> tickets = ticketRepository.findByBookingId(bookingId);
        tickets.forEach(ticket -> ticket.setStatus("CANCELLED"));
        ticketRepository.saveAll(tickets);

        // Update booking status
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        // Restore slots
        Event event = booking.getEvent();
        event.setAvailableSlots(event.getAvailableSlots() + booking.getQuantity());
        eventRepository.save(event);

        // Notify user
        notificationService.sendNotification(booking.getUser(), "Booking Cancelled", 
                "Your booking for event: " + event.getTitle() + " has been cancelled.");
    }

    public List<BookingResponse> getUserBookings(User user) {
        return bookingRepository.findByUserOrderByBookingDateDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingDetails(UUID bookingId, User user, boolean isAdmin) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        if (!isAdmin && !booking.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("Unauthorized to view this booking details");
        }

        return mapToResponse(booking);
    }

    private BookingResponse mapToResponse(Booking booking) {
        List<Ticket> tickets = ticketRepository.findByBookingId(booking.getId());
        List<String> codes = tickets.stream().map(Ticket::getTicketCode).collect(Collectors.toList());
        String transactionId = paymentRepository.findByBookingId(booking.getId())
                .map(Payment::getTransactionId).orElse(null);
        return mapToResponse(booking, codes, transactionId);
    }

    private BookingResponse mapToResponse(Booking booking, List<String> ticketCodes, String transactionId) {
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
                .ticketCodes(ticketCodes)
                .transactionId(transactionId)
                .build();
    }
}
