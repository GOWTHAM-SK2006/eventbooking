package com.eventbooking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping(value = {
        "/login",
        "/signup",
        "/events",
        "/dashboard",
        "/dashboard/events",
        "/dashboard/bookings",
        "/profile",
        "/history"
    })
    public String forward() {
        return "forward:/index.html";
    }

    @GetMapping("/events/{id}")
    public String forwardEventDetails() {
        return "forward:/events/[id].html";
    }
}
