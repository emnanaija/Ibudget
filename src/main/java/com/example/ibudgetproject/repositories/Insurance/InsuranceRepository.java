package com.example.ibudgetproject.repositories.Insurance;

import com.example.ibudgetproject.entities.Insurance.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsuranceRepository extends JpaRepository<InsurancePolicy, Integer>  {
   // List<InsurancePolicy> findByUserId(long userId);
}
