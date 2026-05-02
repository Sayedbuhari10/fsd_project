package com.demo.consumption;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class ConsumptionController {

    @GetMapping("/consumption/summary")
    public Map<String, Object> summary() {
        return Map.of(
                "month", "May",
                "totalKwh", 286,
                "averageDailyKwh", 9.5,
                "peakRoom", "Kitchen",
                "trend", List.of(
                        Map.of("label", "Week 1", "kwh", 64),
                        Map.of("label", "Week 2", "kwh", 71),
                        Map.of("label", "Week 3", "kwh", 76),
                        Map.of("label", "Week 4", "kwh", 75)
                ),
                "tips", List.of(
                        Map.of("title", "Shift heavy loads", "detail", "Run washing and heating equipment after 9 PM."),
                        Map.of("title", "Improve insulation", "detail", "Seal windows in the living room to reduce cooling cost.")
                )
        );
    }
}

