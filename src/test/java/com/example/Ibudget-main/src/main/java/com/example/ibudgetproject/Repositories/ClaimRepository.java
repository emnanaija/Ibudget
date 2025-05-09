package com.example.ibudgetproject.Repositories;

import com.example.ibudgetproject.Entities.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim,Integer> {

    List<Claim> findByInsurancePolicy_Id(int insurance_policy_id);
}
