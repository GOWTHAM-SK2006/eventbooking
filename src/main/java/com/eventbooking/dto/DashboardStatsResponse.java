package com.eventbooking.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
public class DashboardStatsResponse {
    private long totalEvents;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private long totalUsers;
    private List<BookingResponse> recentBookings;
    private Map<String, Long> categorySales;
    private Map<String, BigDecimal> monthlyRevenue;
}
