package com.eventbooking.controller;

import com.eventbooking.dto.TicketResponse;
import com.eventbooking.security.UserDetailsImpl;
import com.eventbooking.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> verifyTicket(@RequestParam String ticketCode) {
        var ticket = ticketService.verifyAndCheckInTicket(ticketCode);
        return ResponseEntity.ok(ticketService.getTicketDetails(ticket.getTicketCode()));
    }

    @GetMapping("/{ticketCode}")
    public ResponseEntity<TicketResponse> getTicket(@PathVariable String ticketCode) {
        return ResponseEntity.ok(ticketService.getTicketDetails(ticketCode));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> getMyTickets(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(ticketService.getUserTickets(user.getId()));
    }

    @GetMapping("/qr/{ticketCode}")
    public ResponseEntity<Map<String, String>> getQr(@PathVariable String ticketCode) {
        TicketResponse ticket = ticketService.getTicketDetails(ticketCode);
        return ResponseEntity.ok(Map.of(
                "ticketCode", ticket.getTicketCode(),
                "qrImageBase64", ticket.getQrImageBase64() != null ? ticket.getQrImageBase64() : ""
        ));
    }
}
