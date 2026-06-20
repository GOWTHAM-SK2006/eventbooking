package com.eventbooking.service;

import com.eventbooking.dto.TicketResponse;
import com.eventbooking.entity.Booking;
import com.eventbooking.entity.Ticket;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.TicketRepository;
import com.eventbooking.util.QrCodeUtil;
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
    public List<Ticket> generateTickets(Booking booking, List<String> seatLabels) {
        List<Ticket> tickets = new ArrayList<>();
        for (int i = 0; i < booking.getQuantity(); i++) {
            String code = "TKT-" + booking.getId().toString().substring(0, 8).toUpperCase()
                    + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            String seatLabel = (seatLabels != null && i < seatLabels.size()) ? seatLabels.get(i) : null;
            String qrData = buildQrData(code, booking, seatLabel);

            Ticket ticket = Ticket.builder()
                    .booking(booking)
                    .ticketCode(code)
                    .seatLabel(seatLabel)
                    .qrData(qrData)
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

    public TicketResponse getTicketDetails(String ticketCode) {
        Ticket ticket = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        return mapToResponse(ticket, true);
    }

    public List<TicketResponse> getUserTickets(UUID userId) {
        return ticketRepository.findAll().stream()
                .filter(t -> t.getBooking().getUser().getId().equals(userId))
                .map(t -> mapToResponse(t, true))
                .toList();
    }

    private TicketResponse mapToResponse(Ticket ticket, boolean includeQr) {
        String qrBase64 = includeQr ? QrCodeUtil.generateBase64Qr(ticket.getQrData()) : null;
        var booking = ticket.getBooking();
        var user = booking.getUser();
        var event = booking.getEvent();

        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketCode(ticket.getTicketCode())
                .status(ticket.getStatus())
                .seatLabel(ticket.getSeatLabel())
                .qrData(ticket.getQrData())
                .qrImageBase64(qrBase64)
                .checkedInAt(ticket.getCheckedInAt())
                .bookingId(booking.getId())
                .eventTitle(event.getTitle())
                .eventDate(event.getStartDate())
                .userName(user.getFirstName() + " " + user.getLastName())
                .build();
    }

    private String buildQrData(String code, Booking booking, String seatLabel) {
        return String.format("{\"code\":\"%s\",\"event\":\"%s\",\"booking\":\"%s\",\"seat\":\"%s\"}",
                code, booking.getEvent().getTitle(), booking.getId(),
                seatLabel != null ? seatLabel : "GA");
    }
}
