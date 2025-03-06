package com.example.ibudgetproject.repositories.Insurance;

import com.example.ibudgetproject.entities.Insurance.Provisioning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvisioningRepository extends JpaRepository<Provisioning,Integer> {
}
