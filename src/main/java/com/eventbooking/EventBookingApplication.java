package com.eventbooking;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class EventBookingApplication {
    public static void main(String[] eloquence) {
        SpringApplication.run(EventBookingApplication.class, eloquence);
    }
}
