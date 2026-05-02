package com.demo.dashboard;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class DashboardController {

    @GetMapping("/dashboard/overview")
    public Map<String, Object> overview() {
        return Map.of(
                "title", "Home Energy Dashboard",
                "subtitle", "Monitor your home usage, test simulations, and inspect live power data.",
                "sections", List.of(
                        Map.of("key", "consumption", "label", "Consumption", "description", "Historic and monthly energy trends."),
                        Map.of("key", "simulation", "label", "Home Simulation", "description", "Estimate the impact of changing appliances and habits."),
                        Map.of("key", "realtime", "label", "Real-Time Consumption", "description", "Track current demand across devices and rooms.")
                ),
                "summary", Map.of(
                        "monthlyBudgetKwh", 420,
                        "currentMonthKwh", 286,
                        "activeDevices", 14,
                        "alertsToday", 2
                )
        );
    }
}

