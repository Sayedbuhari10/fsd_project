package com.demo.simulation;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class SimulationController {

    @GetMapping("/simulation/overview")
    public Map<String, Object> overview() {
        return Map.of(
                "baseMonthlyCost", 54.8,
                "recommendedMonthlyCost", 42.3,
                "scenarios", List.of(
                        Map.of("title", "LED lighting upgrade", "savingPercent", 11, "detail", "Replacing corridor bulbs reduces base load."),
                        Map.of("title", "Smart thermostat schedule", "savingPercent", 15, "detail", "Cooling only occupied rooms lowers HVAC demand."),
                        Map.of("title", "Solar daytime scheduling", "savingPercent", 8, "detail", "Move dishwasher and laundry cycles to solar hours.")
                )
        );
    }
}

