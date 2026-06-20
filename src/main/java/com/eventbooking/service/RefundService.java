package com.eventbooking.service;

import com.eventbooking.config.AppProperties;
import com.eventbooking.dto.RefundRequest;
import com.eventbooking.dto.RefundResponse;
import com.eventbooking.entity.*;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.BookingRepository;
import com.eventbooking.repository.PaymentRepository;
import com.eventbooking.repository.RefundRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RefundService {
    private final RefundRepository refundRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final NotificationService notificationService;

    public RefundService(RefundRepository refundRepository, BookingRepository bookingRepository,
                         PaymentRepository paymentRepository, NotificationService notificationService) {
        this.refundRepository = refundRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public RefundResponse requestRefund(RefundRequest request, User user) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Unauthorized refund request");
        }
        if (!"CONFIRMED".equals(booking.getStatus())) {
            throw new BadRequestException("Only confirmed bookings can be refunded");
        }

        Payment payment = paymentRepository.findByBookingId(booking.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        Refund refund = Refund.builder()
                .booking(booking)
                .payment(payment)
                .user(user)
                .amount(booking.getTotalPrice())
                .reason(request.getReason())
                .status("PENDING")
                .build();

        refund = refundRepository.save(refund);
        notificationService.sendNotification(user, "Refund Requested",
                "Your refund request for " + booking.getEvent().getTitle() + " is being processed.");

        return map(refund);
    }

    @Transactional
    public RefundResponse processRefund(UUID refundId, String status) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new ResourceNotFoundException("Refund not found"));

        refund.setStatus(status);
        refund.setProcessedAt(LocalDateTime.now());
        refundRepository.save(refund);

        if ("APPROVED".equals(status) || "COMPLETED".equals(status)) {
            Payment payment = refund.getPayment();
            payment.setStatus("REFUNDED");
            paymentRepository.save(payment);
            notificationService.sendNotification(refund.getUser(), "Refund Approved",
                    "Your refund of Rs " + refund.getAmount() + " has been approved.");
        }

        return map(refund);
    }

    public List<RefundResponse> getUserRefunds(User user) {
        return refundRepository.findByUserOrderByRequestedAtDesc(user).stream().map(this::map).toList();
    }

    public List<RefundResponse> getAllRefunds() {
        return refundRepository.findAllByOrderByRequestedAtDesc().stream().map(this::map).toList();
    }

    private RefundResponse map(Refund r) {
        return RefundResponse.builder()
                .id(r.getId())
                .bookingId(r.getBooking() != null ? r.getBooking().getId() : null)
                .paymentId(r.getPayment() != null ? r.getPayment().getId() : null)
                .amount(r.getAmount())
                .reason(r.getReason())
                .status(r.getStatus())
                .requestedAt(r.getRequestedAt())
                .processedAt(r.getProcessedAt())
                .build();
    }
}
