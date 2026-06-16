package com.eventbooking.service;

import com.eventbooking.entity.Booking;
import com.eventbooking.entity.Ticket;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    @Transactional
    public List<Ticket> generateTickets(Booking booking) {
        List<Ticket> tickets = new ArrayList<>();
        for (int i = 0; i < booking.getQuantity(); i++) {
            String code = "TKT-" + booking.getId().toString().substring(0, 8).toUpperCase() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            Ticket ticket = Ticket.builder()
                    .booking(booking)
                    .ticketCode(code)
                    .status("ACTIVE")
                    .build();
            tickets.add(ticketRepository.save(ticket));
        }
        return tickets;
    }

    @Transactional
    public Ticket verifyAndCheckInTicket(String ticketCode) {
        Ticket ticket = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with code: " + ticketCode));

        if (!"ACTIVE".equals(ticket.getStatus())) {
            throw new BadRequestException("Ticket is already used or cancelled. Current status: " + ticket.getStatus());
        }

        var event = ticket.getBooking().getEvent();
        if (LocalDateTime.now().isAfter(event.getEndDate())) {
            throw new BadRequestException("This event has already ended");
        }

        ticket.setStatus("USED");
        ticket.setCheckedInAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getTicketsByBooking(UUID bookingId) {
        return ticketRepository.findByBookingId(bookingId);
    }
}
