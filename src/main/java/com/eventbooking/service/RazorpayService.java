package com.eventbooking.service;

import com.eventbooking.config.AppProperties;
import com.eventbooking.exception.BadRequestException;
import org.springframework.stereotype.Service;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;

@Service
public class RazorpayService {
    private final AppProperties appProperties;

    public RazorpayService(AppProperties appProperties) {
        this.appProperties = appProperties;
    }

    public String getKeyId() {
        return appProperties.getRazorpayKeyId();
    }

    public boolean verifySignature(String orderId, String paymentId, String signature) {
        String secret = appProperties.getRazorpayKeySecret();
        if (secret == null || secret.isBlank()) {
            return paymentId != null && !paymentId.isBlank();
        }
        if (orderId == null || paymentId == null || signature == null) {
            return false;
        }
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String expected = HexFormat.of().formatHex(hash);
            return expected.equalsIgnoreCase(signature);
        } catch (Exception e) {
            throw new BadRequestException("Payment verification failed");
        }
    }
}
