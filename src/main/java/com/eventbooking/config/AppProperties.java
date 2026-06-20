package com.eventbooking.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppProperties {
    @Value("${app.razorpay.key-id}")
    private String razorpayKeyId;

    @Value("${app.razorpay.key-secret:}")
    private String razorpayKeySecret;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    @Value("${app.gst-rate:18}")
    private int gstRate;

    @Value("${app.frontend-url:http://localhost:8080}")
    private String frontendUrl;

    public String getRazorpayKeyId() { return razorpayKeyId; }
    public String getRazorpayKeySecret() { return razorpayKeySecret; }
    public String getGoogleClientId() { return googleClientId; }
    public int getGstRate() { return gstRate; }
    public String getFrontendUrl() { return frontendUrl; }
}
