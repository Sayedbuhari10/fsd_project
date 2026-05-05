package com.demo.consumption.controller;

public class AnalyticsResponse {

    private double currentLoad;
    private double monthlyKwh;
    private double bill;

    public AnalyticsResponse(double currentLoad, double monthlyKwh, double bill) {
        this.currentLoad = currentLoad;
        this.monthlyKwh = monthlyKwh;
        this.bill = bill;
    }

    public double getCurrentLoad() { return currentLoad; }
    public double getMonthlyKwh() { return monthlyKwh; }
    public double getBill() { return bill; }
}