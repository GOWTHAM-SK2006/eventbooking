package com.eventbooking.controller;

import com.eventbooking.entity.Ticket;
import com.eventbooking.service.TicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Ticket> verifyTicket(@RequestParam String ticketCode) {
        Ticket ticket = ticketService.verifyAndCheckInTicket(ticketCode);
        return ResponseEntity.ok(ticket);
    }
}
