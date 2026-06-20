package com.eventbooking.service;

import com.eventbooking.dto.CouponRequest;
import com.eventbooking.dto.CouponResponse;
import com.eventbooking.dto.CouponValidationResponse;
import com.eventbooking.entity.Coupon;
import com.eventbooking.exception.BadRequestException;
import com.eventbooking.exception.ResourceNotFoundException;
import com.eventbooking.repository.CouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CouponService {
    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public CouponValidationResponse validateCoupon(String code, BigDecimal orderAmount) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElse(null);

        if (coupon == null || !coupon.isActive()) {
            return CouponValidationResponse.builder().valid(false).message("Invalid coupon code").build();
        }

        LocalDateTime now = LocalDateTime.now();
        if (coupon.getValidFrom() != null && now.isBefore(coupon.getValidFrom())) {
            return CouponValidationResponse.builder().valid(false).message("Coupon is not yet active").build();
        }
        if (coupon.getValidUntil() != null && now.isAfter(coupon.getValidUntil())) {
            return CouponValidationResponse.builder().valid(false).message("Coupon has expired").build();
        }
        if (coupon.getMaxUses() != null && coupon.getUsedCount() >= coupon.getMaxUses()) {
            return CouponValidationResponse.builder().valid(false).message("Coupon usage limit reached").build();
        }
        if (orderAmount.compareTo(coupon.getMinOrderAmount()) < 0) {
            return CouponValidationResponse.builder()
                    .valid(false)
                    .message("Minimum order amount is " + coupon.getMinOrderAmount())
                    .build();
        }

        BigDecimal discount = calculateDiscount(coupon, orderAmount);
        BigDecimal finalAmount = orderAmount.subtract(discount).max(BigDecimal.ZERO);

        return CouponValidationResponse.builder()
                .valid(true)
                .message("Coupon applied successfully")
                .discountAmount(discount)
                .finalAmount(finalAmount)
                .couponCode(coupon.getCode())
                .build();
    }

    public BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderAmount) {
        if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
            return orderAmount.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }
        return coupon.getDiscountValue().min(orderAmount);
    }

    @Transactional
    public void incrementUsage(String code) {
        couponRepository.findByCodeIgnoreCase(code).ifPresent(c -> {
            c.setUsedCount(c.getUsedCount() + 1);
            couponRepository.save(c);
        });
    }

    public List<CouponResponse> getAllCoupons() {
        return couponRepository.findAll().stream().map(this::map).toList();
    }

    @Transactional
    public CouponResponse createCoupon(CouponRequest request) {
        if (couponRepository.findByCodeIgnoreCase(request.getCode()).isPresent()) {
            throw new BadRequestException("Coupon code already exists");
        }
        Coupon coupon = Coupon.builder()
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minOrderAmount(request.getMinOrderAmount() != null ? request.getMinOrderAmount() : BigDecimal.ZERO)
                .maxUses(request.getMaxUses())
                .validUntil(request.getValidUntil())
                .active(request.isActive())
                .build();
        return map(couponRepository.save(coupon));
    }

    @Transactional
    public void deleteCoupon(UUID id) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        couponRepository.delete(coupon);
    }

    private CouponResponse map(Coupon c) {
        return CouponResponse.builder()
                .id(c.getId())
                .code(c.getCode())
                .description(c.getDescription())
                .discountType(c.getDiscountType())
                .discountValue(c.getDiscountValue())
                .minOrderAmount(c.getMinOrderAmount())
                .maxUses(c.getMaxUses())
                .usedCount(c.getUsedCount())
                .validUntil(c.getValidUntil())
                .active(c.isActive())
                .build();
    }
}
