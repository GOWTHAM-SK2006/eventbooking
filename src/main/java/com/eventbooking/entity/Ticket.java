package com.eventbooking.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE tickets SET deleted = true WHERE id = ?")
@SQLRestriction("deleted = false")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "ticket_code", nullable = false, unique = true)
    private String ticketCode;

    @Column(nullable = false)
    private String status; // e.g., ACTIVE, USED, CANCELLED

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "seat_label", length = 20)
    private String seatLabel;

    @Column(name = "qr_data", columnDefinition = "TEXT")
    private String qrData;

    @Builder.Default
    private boolean deleted = false;
}
