package com.demo.consumption.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.demo.consumption.model.Appliance;
import com.demo.consumption.repository.ApplianceRepository;

import java.util.List;

@RestController
@RequestMapping("/consumption")
public class ConsumptionController {

    @Autowired
    private ApplianceRepository repository;

    @GetMapping("/analytics/{userId}")
    public AnalyticsResponse getAnalytics(@PathVariable Long userId) {

        List<Appliance> appliances = repository.findByUserId(userId);

        // 🔹 Current load (only ON appliances)
        double currentLoad = appliances.stream()
                .filter(Appliance::isStatus)
                .mapToDouble(Appliance::getWatts)
                .sum();

        // 🔹 Monthly usage (assuming 24h usage)
        double monthlyKwh = (currentLoad * 24 * 30) / 1000;

        // 🔹 Electricity bill (₹6.5 per unit)
        double bill = monthlyKwh * 6.5;

        return new AnalyticsResponse(currentLoad, monthlyKwh, bill);
    }
}