package com.example.ibudgetproject.Repositories;

import com.example.ibudgetproject.Entities.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InsuranceRepository extends JpaRepository<InsurancePolicy, Integer>  {
   // List<InsurancePolicy> findByUserId(long userId);
}
