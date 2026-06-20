package com.eventbooking.service;

import com.eventbooking.entity.Event;
import com.eventbooking.entity.EventSeat;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.repository.EventSeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EventSeatService {
    private final EventSeatRepository eventSeatRepository;

    public EventSeatService(EventSeatRepository eventSeatRepository) {
        this.eventSeatRepository = eventSeatRepository;
    }

    @Transactional
    public void generateSeats(Event event) {
        List<EventSeat> existing = eventSeatRepository.findByEvent(event);
        if (!existing.isEmpty()) return;

        List<EventSeat> seats = new ArrayList<>();
        int rows = Math.min(10, (int) Math.ceil(event.getCapacity() / 10.0));
        int cols = (int) Math.ceil((double) event.getCapacity() / rows);
        int count = 0;
        for (int r = 1; r <= rows && count < event.getCapacity(); r++) {
            for (int c = 1; c <= cols && count < event.getCapacity(); c++) {
                seats.add(EventSeat.builder()
                        .event(event)
                        .seatLabel((char) ('A' + r - 1) + String.valueOf(c))
                        .status("AVAILABLE")
                        .build());
                count++;
            }
        }
        eventSeatRepository.saveAll(seats);
    }

    public List<EventSeat> getAvailableSeats(Event event) {
        return eventSeatRepository.findByEventAndStatus(event, "AVAILABLE");
    }

    public List<EventSeat> getAllSeats(Event event) {
        return eventSeatRepository.findByEvent(event);
    }

    @Transactional
    public void reserveSeats(Event event, List<String> seatLabels, UUID bookingId) {
        List<EventSeat> seats = eventSeatRepository.findByEvent(event);
        for (String label : seatLabels) {
            EventSeat seat = seats.stream()
                    .filter(s -> s.getSeatLabel().equalsIgnoreCase(label))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("Seat not found: " + label));
            if (!"AVAILABLE".equals(seat.getStatus())) {
                throw new BadRequestException("Seat already booked: " + label);
            }
            seat.setStatus("BOOKED");
            seat.setBookingId(bookingId);
            eventSeatRepository.save(seat);
        }
    }

    @Transactional
    public void releaseSeats(UUID bookingId) {
        eventSeatRepository.findAll().stream()
                .filter(s -> bookingId.equals(s.getBookingId()))
                .forEach(s -> {
                    s.setStatus("AVAILABLE");
                    s.setBookingId(null);
                    eventSeatRepository.save(s);
                });
    }
}
