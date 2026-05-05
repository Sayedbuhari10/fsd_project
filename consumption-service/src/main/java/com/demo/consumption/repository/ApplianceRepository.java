package com.demo.consumption.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.demo.consumption.model.Appliance;

import java.util.List;

public interface ApplianceRepository extends JpaRepository<Appliance, Long> {
    List<Appliance> findByUserId(Long userId);
}