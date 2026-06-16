package com.eventbooking.service;

import com.eventbooking.entity.Booking;
import com.eventbooking.entity.Payment;
import com.eventbooking.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public Payment processPayment(Booking booking, String paymentMethod) {
        // Simulate a successful payment gateway transaction
        String transactionId = "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .paymentMethod(paymentMethod)
                .transactionId(transactionId)
                .status("COMPLETED")
                .paymentDate(LocalDateTime.now())
                .build();

        return paymentRepository.save(payment);
    }
}
