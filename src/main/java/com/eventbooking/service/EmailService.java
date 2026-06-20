package com.eventbooking.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    public void sendVerificationEmail(String email, String token, String frontendUrl) {
        String link = frontendUrl + "/verify-email?token=" + token;
        log.info("EMAIL [Verification] to={} link={}", email, link);
    }

    public void sendPasswordResetEmail(String email, String token, String frontendUrl) {
        String link = frontendUrl + "/reset-password?token=" + token;
        log.info("EMAIL [Password Reset] to={} link={}", email, link);
    }

    public void sendTicketEmail(String email, String eventTitle, String ticketCode) {
        log.info("EMAIL [Ticket] to={} event={} code={}", email, eventTitle, ticketCode);
    }

    public void sendBookingConfirmation(String email, String eventTitle, int quantity) {
        log.info("EMAIL [Booking Confirmed] to={} event={} qty={}", email, eventTitle, quantity);
    }
}
