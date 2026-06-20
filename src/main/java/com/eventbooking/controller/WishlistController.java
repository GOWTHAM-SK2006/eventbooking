package com.eventbooking.controller;

import com.eventbooking.dto.*;
import com.eventbooking.entity.User;
import com.eventbooking.security.UserDetailsImpl;
import com.eventbooking.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getWishlist(@AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(wishlistService.getWishlist(User.builder().id(user.getId()).build()));
    }

    @PostMapping("/{eventId}")
    public ResponseEntity<MessageResponse> add(@PathVariable UUID eventId, @AuthenticationPrincipal UserDetailsImpl user) {
        wishlistService.addToWishlist(User.builder().id(user.getId()).build(), eventId);
        return ResponseEntity.ok(new MessageResponse("Added to wishlist"));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<MessageResponse> remove(@PathVariable UUID eventId, @AuthenticationPrincipal UserDetailsImpl user) {
        wishlistService.removeFromWishlist(User.builder().id(user.getId()).build(), eventId);
        return ResponseEntity.ok(new MessageResponse("Removed from wishlist"));
    }
}
