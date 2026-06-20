package com.eventbooking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/login")
    public String login() {
        return "forward:/login.html";
    }

    @GetMapping("/signup")
    public String signup() {
        return "forward:/signup.html";
    }

    @GetMapping("/forgot-password")
    public String forgotPassword() {
        return "forward:/forgot-password.html";
    }

    @GetMapping("/reset-password")
    public String resetPassword() {
        return "forward:/reset-password.html";
    }

    @GetMapping("/verify-email")
    public String verifyEmail() {
        return "forward:/verify-email.html";
    }

    @GetMapping("/events")
    public String events() {
        return "forward:/events.html";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "forward:/dashboard.html";
    }

    @GetMapping("/organizer")
    public String organizer() {
        return "forward:/organizer.html";
    }

    @GetMapping("/profile")
    public String profile() {
        return "forward:/profile.html";
    }

    @GetMapping("/wishlist")
    public String wishlist() {
        return "forward:/wishlist.html";
    }

    @GetMapping("/tickets")
    public String tickets() {
        return "forward:/tickets.html";
    }

    @GetMapping("/notifications")
    public String notifications() {
        return "forward:/notifications.html";
    }

    @GetMapping("/events/{id:[^\\.]+}")
    public String forwardEventDetails() {
        return "forward:/events/fallback.html";
    }

    // Admin Console mappings
    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "forward:/admin/dashboard.html";
    }

    @GetMapping("/admin/events")
    public String adminEvents() {
        return "forward:/admin/events.html";
    }

    @GetMapping("/admin/events/create")
    public String adminEventsCreate() {
        return "forward:/admin/events/create.html";
    }

    @GetMapping("/admin/bookings")
    public String adminBookings() {
        return "forward:/admin/bookings.html";
    }

    @GetMapping("/admin/users")
    public String adminUsers() {
        return "forward:/admin/users.html";
    }

    @GetMapping("/admin/payments")
    public String adminPayments() {
        return "forward:/admin/payments.html";
    }

    @GetMapping("/admin/analytics")
    public String adminAnalytics() {
        return "forward:/admin/analytics.html";
    }

    @GetMapping("/admin/settings")
    public String adminSettings() {
        return "forward:/admin/settings.html";
    }

    @GetMapping("/admin/announcements")
    public String adminAnnouncements() {
        return "forward:/admin/announcements.html";
    }
}
