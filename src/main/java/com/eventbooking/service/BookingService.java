package com.eventbooking.service;

import com.eventbooking.dto.BookingRequest;
import com.eventbooking.dto.BookingResponse;
import com.eventbooking.entity.*;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.*;
import com.eventbooking.util.JsonUtils;
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
    private final CouponService couponService;
    private final EventSeatService eventSeatService;
    private final EventService eventService;
    private final EmailService emailService;

    public BookingService(BookingRepository bookingRepository, EventRepository eventRepository,
                          PaymentService paymentService, TicketService ticketService,
                          NotificationService notificationService, PaymentRepository paymentRepository,
                          TicketRepository ticketRepository, CouponService couponService,
                          EventSeatService eventSeatService, EventService eventService,
                          EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.eventRepository = eventRepository;
        this.paymentService = paymentService;
        this.ticketService = ticketService;
        this.notificationService = notificationService;
        this.paymentRepository = paymentRepository;
        this.ticketRepository = ticketRepository;
        this.couponService = couponService;
        this.eventSeatService = eventSeatService;
        this.eventService = eventService;
        this.emailService = emailService;
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

        int quantity = request.getQuantity();
        if (event.isSeatSelectionEnabled() && request.getSelectedSeats() != null && !request.getSelectedSeats().isEmpty()) {
            quantity = request.getSelectedSeats().size();
        }

        if (event.getAvailableSlots() < quantity) {
            throw new BadRequestException("Not enough available tickets. Remaining slots: " + event.getAvailableSlots());
        }

        BigDecimal subtotal = event.getPrice().multiply(BigDecimal.valueOf(quantity));
        BigDecimal discountAmount = BigDecimal.ZERO;
        String couponCode = null;

        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            var validation = couponService.validateCoupon(request.getCouponCode(), subtotal);
            if (!validation.isValid()) {
                throw new BadRequestException(validation.getMessage());
            }
            discountAmount = validation.getDiscountAmount();
            couponCode = validation.getCouponCode();
            couponService.incrementUsage(couponCode);
        }

        BigDecimal total = subtotal.subtract(discountAmount).max(BigDecimal.ZERO);

        event.setAvailableSlots(event.getAvailableSlots() - quantity);
        eventRepository.save(event);

        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .quantity(quantity)
                .totalPrice(total)
                .couponCode(couponCode)
                .discountAmount(discountAmount)
                .selectedSeats(request.getSelectedSeats() != null ? JsonUtils.toJson(request.getSelectedSeats()) : null)
                .status("PENDING")
                .build();
        booking = bookingRepository.save(booking);

        if (event.isSeatSelectionEnabled() && request.getSelectedSeats() != null) {
            eventSeatService.reserveSeats(event, request.getSelectedSeats(), booking.getId());
        }

        String paymentMethod = total.compareTo(BigDecimal.ZERO) == 0 ? "FREE" : request.getPaymentMethod();
        Payment payment = paymentService.processPayment(booking, paymentMethod, discountAmount, couponCode,
                request.getRazorpayOrderId(), request.getRazorpayPaymentId(), request.getRazorpaySignature());

        booking.setStatus("CONFIRMED");
        booking = bookingRepository.save(booking);

        List<String> seatLabels = request.getSelectedSeats();
        List<Ticket> tickets = ticketService.generateTickets(booking, seatLabels);
        List<String> ticketCodes = tickets.stream().map(Ticket::getTicketCode).collect(Collectors.toList());

        eventService.incrementBookingCount(event);

        notificationService.sendNotification(user, "Booking Confirmed!",
                "Successfully booked " + quantity + " ticket(s) for: " + event.getTitle());
        notificationService.sendNotification(user, "Payment Successful",
                "Payment of Rs " + total + " received for " + event.getTitle());

        emailService.sendBookingConfirmation(user.getEmail(), event.getTitle(), quantity);
        tickets.forEach(t -> emailService.sendTicketEmail(user.getEmail(), event.getTitle(), t.getTicketCode()));

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

        List<Ticket> tickets = ticketRepository.findByBookingId(bookingId);
        tickets.forEach(ticket -> ticket.setStatus("CANCELLED"));
        ticketRepository.saveAll(tickets);

        eventSeatService.releaseSeats(bookingId);

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);

        Event event = booking.getEvent();
        event.setAvailableSlots(event.getAvailableSlots() + booking.getQuantity());
        eventRepository.save(event);

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

    public List<BookingResponse> getEventBookings(UUID eventId) {
        return bookingRepository.findByEventId(eventId).stream()
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
