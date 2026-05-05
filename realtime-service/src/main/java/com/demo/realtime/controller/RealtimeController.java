package com.demo.realtime.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.demo.realtime.model.Appliance;
import com.demo.realtime.repository.ApplianceRepository;

import java.util.List;

@RestController
@RequestMapping("/realtime")
public class RealtimeController {

    @Autowired
    private ApplianceRepository repository;

    // ✅ 1. Get appliances
    @GetMapping("/appliances/{userId}")
    public List<Appliance> getAppliances(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }

    // ✅ 2. Toggle ON/OFF
    @PutMapping("/appliances/{id}/toggle")
    public Appliance toggleAppliance(@PathVariable Long id) {
        Appliance appliance = repository.findById(id).orElseThrow();

        appliance.setStatus(!appliance.isStatus()); // toggle
        return repository.save(appliance);
    }

    // ✅ 3. Current total load
    @GetMapping("/load/{userId}")
    public double getCurrentLoad(@PathVariable Long userId) {
        List<Appliance> appliances = repository.findByUserId(userId);

        return appliances.stream()
                .filter(Appliance::isStatus)
                .mapToDouble(Appliance::getWatts)
                .sum();
    }
}