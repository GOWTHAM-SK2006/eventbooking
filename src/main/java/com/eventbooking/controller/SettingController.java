package com.eventbooking.controller;

import com.eventbooking.entity.AppSetting;
import com.eventbooking.repository.AppSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
public class SettingController {

    @Autowired
    private AppSettingRepository appSettingRepository;

    @GetMapping("/{key}")
    public ResponseEntity<?> getSetting(@PathVariable String key) {
        Optional<AppSetting> setting = appSettingRepository.findById(key);
        if (setting.isPresent()) {
            return ResponseEntity.ok(Map.of("value", setting.get().getSettingValue()));
        } else {
            // Default payment settings
            if ("payment".equals(key)) {
                return ResponseEntity.ok(Map.of("value", "{\"upiId\":\"\",\"phoneNumber\":\"\",\"qrCodeUrl\":\"\",\"instructions\":\"Please pay using UPI or Razorpay.\"}"));
            }
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSetting(@PathVariable String key, @RequestBody Map<String, String> payload) {
        String value = payload.get("value");
        AppSetting setting = appSettingRepository.findById(key).orElse(new AppSetting(key, ""));
        setting.setSettingValue(value);
        appSettingRepository.save(setting);
        return ResponseEntity.ok(Map.of("message", "Setting updated successfully"));
    }
}
