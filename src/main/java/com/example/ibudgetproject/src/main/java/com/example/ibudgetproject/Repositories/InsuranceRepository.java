package com.example.ibudgetproject.Repositories;

import com.example.ibudgetproject.Entities.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InsuranceRepository extends JpaRepository<InsurancePolicy, Integer>  {

}
