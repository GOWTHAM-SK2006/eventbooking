package com.eventbooking.controller;

import com.eventbooking.dto.PaymentResponse;
import com.eventbooking.dto.RefundRequest;
import com.eventbooking.dto.RefundResponse;
import com.eventbooking.entity.User;
import com.eventbooking.security.UserDetailsImpl;
import com.eventbooking.service.PaymentService;
import com.eventbooking.service.RazorpayService;
import com.eventbooking.service.RefundService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;
    private final RefundService refundService;
    private final RazorpayService razorpayService;

    public PaymentController(PaymentService paymentService, RefundService refundService,
                             RazorpayService razorpayService) {
        this.paymentService = paymentService;
        this.refundService = refundService;
        this.razorpayService = razorpayService;
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, String>> getConfig() {
        return ResponseEntity.ok(Map.of("keyId", razorpayService.getKeyId()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(paymentService.getUserPayments(User.builder().id(user.getId()).build()));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<PaymentResponse> getByBooking(@PathVariable UUID bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentByBooking(bookingId));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @PostMapping("/refund")
    public ResponseEntity<RefundResponse> requestRefund(@Valid @RequestBody RefundRequest request,
                                                        @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(refundService.requestRefund(request, User.builder().id(user.getId()).build()));
    }

    @GetMapping("/refunds")
    public ResponseEntity<List<RefundResponse>> getUserRefunds(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(refundService.getUserRefunds(User.builder().id(user.getId()).build()));
    }

    @GetMapping("/refunds/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<RefundResponse>> getAllRefunds() {
        return ResponseEntity.ok(refundService.getAllRefunds());
    }

    @PutMapping("/refunds/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RefundResponse> processRefund(@PathVariable UUID id, @RequestParam String status) {
        return ResponseEntity.ok(refundService.processRefund(id, status));
    }
}
