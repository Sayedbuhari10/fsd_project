package com.demo.meter;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class MeterController {

    @GetMapping("/meters")
    public List<Map<String, String>> meters() {
        return List.of(
                Map.of("id", "M-01", "name", "Academic Block Meter", "zone", "Academic Block", "type", "Three Phase", "status", "ONLINE"),
                Map.of("id", "M-02", "name", "Library Meter", "zone", "Library", "type", "Smart Meter", "status", "ONLINE"),
                Map.of("id", "M-03", "name", "Hostel Meter", "zone", "Hostel", "type", "Three Phase", "status", "ONLINE"),
                Map.of("id", "M-04", "name", "Lab Meter", "zone", "Computer Lab", "type", "IoT Meter", "status", "SERVICE")
        );
    }
}

