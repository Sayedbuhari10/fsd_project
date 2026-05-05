package com.demo.simulation.model;

import javax.persistence.*;

@Entity
public class Appliance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private double watts;
    private boolean status;

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getWatts() { return watts; }
    public void setWatts(double watts) { this.watts = watts; }

    public boolean isStatus() { return status; }
    public void setStatus(boolean status) { this.status = status; }
}