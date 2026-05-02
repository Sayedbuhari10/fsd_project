package com.demo.realtime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class RealtimeController {

    @GetMapping("/realtime/overview")
    public Map<String, Object> overview() {
        return Map.of(
                "currentWatts", 3120,
                "gridStatus", "NORMAL",
                "devices", List.of(
                        Map.of("name", "Air Conditioner", "room", "Bedroom", "watts", 1290),
                        Map.of("name", "Refrigerator", "room", "Kitchen", "watts", 310),
                        Map.of("name", "Water Heater", "room", "Bathroom", "watts", 980),
                        Map.of("name", "Television", "room", "Living Room", "watts", 135)
                )
        );
    }
}

