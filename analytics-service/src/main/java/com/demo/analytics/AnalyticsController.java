package com.demo.analytics;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class AnalyticsController {

    @GetMapping("/analytics/overview")
    public Map<String, Object> overview() {
        return Map.of(
                "todayUsageKwh", 376,
                "weeklyAverageKwh", 352,
                "peakZone", "Computer Lab",
                "recommendations", List.of(
                        Map.of("title", "Move lab backups to off-peak hours", "detail", "Shifting scheduled backups after 8 PM reduces afternoon demand."),
                        Map.of("title", "Pre-cool academic block", "detail", "Start HVAC 10 minutes earlier to avoid a sharp noon spike."),
                        Map.of("title", "Monitor hostel night load", "detail", "Track unmanaged loads between 10 PM and midnight.")
                )
        );
    }
}

