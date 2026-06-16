package com.eventbooking.controller;

import com.eventbooking.dto.ReviewRequest;
import com.eventbooking.dto.ReviewResponse;
import com.eventbooking.entity.User;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.UserRepository;
import com.eventbooking.security.UserDetailsImpl;
import com.eventbooking.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    public ReviewController(ReviewService reviewService, UserRepository userRepository) {
        this.reviewService = reviewService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        ReviewResponse response = reviewService.addReview(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsForEvent(@PathVariable UUID eventId) {
        List<ReviewResponse> reviews = reviewService.getReviewsForEvent(eventId);
        return ResponseEntity.ok(reviews);
    }
}
