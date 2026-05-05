package com.demo.simulation.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import com.demo.simulation.model.Appliance;
import com.demo.simulation.repository.ApplianceRepository;

@RestController
@RequestMapping("/simulation")
public class SimulationController {

    @Autowired
    private ApplianceRepository repository;

    @PostMapping("/appliances")
    public Appliance addAppliance(@RequestBody Appliance appliance) {
        appliance.setStatus(false);
        return repository.save(appliance);
    }

    @GetMapping("/appliances/{userId}")
    public List<Appliance> getAppliances(@PathVariable Long userId) {
        return repository.findByUserId(userId);
    }
}