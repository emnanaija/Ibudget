package com.example.ibudgetproject.Repositories;

import com.example.ibudgetproject.Entities.Provisioning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvisioningRepository extends JpaRepository<Provisioning,Integer> {
}
