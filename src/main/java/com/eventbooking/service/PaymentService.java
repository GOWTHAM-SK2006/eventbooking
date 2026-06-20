package com.eventbooking.service;

import com.eventbooking.config.AppProperties;
import com.eventbooking.dto.PaymentResponse;
import com.eventbooking.entity.Booking;
import com.eventbooking.entity.Payment;
import com.eventbooking.entity.User;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RazorpayService razorpayService;
    private final AppProperties appProperties;
    private static int invoiceCounter = 1000;

    public PaymentService(PaymentRepository paymentRepository, RazorpayService razorpayService,
                          AppProperties appProperties) {
        this.paymentRepository = paymentRepository;
        this.razorpayService = razorpayService;
        this.appProperties = appProperties;
    }

    @Transactional
    public Payment processPayment(Booking booking, String paymentMethod, BigDecimal discountAmount,
                                  String couponCode, String razorpayOrderId, String razorpayPaymentId,
                                  String razorpaySignature) {
        if ("RAZORPAY".equalsIgnoreCase(paymentMethod) || "CARD".equalsIgnoreCase(paymentMethod)) {
            if (razorpayPaymentId != null && razorpayOrderId != null) {
                if (!razorpayService.verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
                    throw new BadRequestException("Payment verification failed");
                }
            }
        }

        String transactionId;
        String actualMethod;

        if (paymentMethod != null && paymentMethod.startsWith("UPI-")) {
            actualMethod = "UPI QR";
            transactionId = paymentMethod.substring(4);
        } else if ("RAZORPAY".equalsIgnoreCase(paymentMethod) && razorpayPaymentId != null) {
            actualMethod = "RAZORPAY";
            transactionId = razorpayPaymentId;
        } else if ("FREE".equalsIgnoreCase(paymentMethod)) {
            actualMethod = "FREE";
            transactionId = "FREE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } else {
            actualMethod = paymentMethod != null ? paymentMethod : "CARD";
            transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }

        BigDecimal amount = booking.getTotalPrice();
        BigDecimal gstAmount = calculateGst(amount);

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(amount)
                .gstAmount(gstAmount)
                .paymentMethod(actualMethod)
                .transactionId(transactionId)
                .razorpayOrderId(razorpayOrderId)
                .razorpayPaymentId(razorpayPaymentId)
                .couponCode(couponCode)
                .invoiceNumber("INV-" + (++invoiceCounter))
                .status("COMPLETED")
                .paymentDate(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }

    public BigDecimal calculateGst(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(appProperties.getGstRate()))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }

    public List<PaymentResponse> getUserPayments(User user) {
        return paymentRepository.findAll().stream()
                .filter(p -> p.getBooking().getUser().getId().equals(user.getId()))
                .map(this::mapToResponse)
                .toList();
    }

    public PaymentResponse getPaymentByBooking(UUID bookingId) {
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        return mapToResponse(payment);
    }

    public List<PaymentResponse> getAllPayments() {
        return paymentRepository.findAll().stream().map(this::mapToResponse).toList();
    }

    private PaymentResponse mapToResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .bookingId(payment.getBooking().getId())
                .amount(payment.getAmount())
                .gstAmount(payment.getGstAmount())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .razorpayOrderId(payment.getRazorpayOrderId())
                .razorpayPaymentId(payment.getRazorpayPaymentId())
                .invoiceNumber(payment.getInvoiceNumber())
                .couponCode(payment.getCouponCode())
                .status(payment.getStatus())
                .paymentDate(payment.getPaymentDate())
                .eventTitle(payment.getBooking().getEvent().getTitle())
                .build();
    }
}
