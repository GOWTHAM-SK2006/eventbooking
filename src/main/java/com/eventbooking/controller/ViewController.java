package com.eventbooking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping(value = {
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/events",
        "/dashboard",
        "/organizer",
        "/dashboard/events",
        "/dashboard/bookings",
        "/profile",
        "/history",
        "/wishlist",
        "/notifications",
        "/payments",
        "/organizer"
    })
    public String forward() {
        return "forward:/index.html";
    }

    @GetMapping("/events/{id:[^\\.]+}")
    public String forwardEventDetails() {
        return "forward:/events/fallback.html";
    }
}
