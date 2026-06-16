package com.eventbooking.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping(value = {
        "/login",
        "/signup",
        "/events",
        "/events/{id}",
        "/dashboard",
        "/dashboard/events",
        "/dashboard/bookings",
        "/profile",
        "/history"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
