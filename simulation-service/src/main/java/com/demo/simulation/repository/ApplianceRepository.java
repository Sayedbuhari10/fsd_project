package com.demo.simulation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.demo.simulation.model.Appliance;
import java.util.List;

public interface ApplianceRepository extends JpaRepository<Appliance, Long> {
    List<Appliance> findByUserId(Long userId);
}