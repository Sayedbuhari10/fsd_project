package com.demo.alert;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class AlertController {

    @GetMapping("/alerts")
    public List<Map<String, String>> alerts() {
        return List.of(
                Map.of("id", "AL-01", "title", "Critical Load Spike", "message", "Computer Lab crossed the preferred load threshold.", "severity", "CRITICAL"),
                Map.of("id", "AL-02", "title", "Maintenance Reminder", "message", "Lab meter calibration is due this week.", "severity", "WARNING"),
                Map.of("id", "AL-03", "title", "After-hours Usage", "message", "Hostel block shows higher-than-average night consumption.", "severity", "WARNING")
        );
    }
}

