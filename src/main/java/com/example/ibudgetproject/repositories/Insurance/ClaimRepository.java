package com.example.ibudgetproject.repositories.Insurance;

import com.example.ibudgetproject.entities.Insurance.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim,Integer> {

    List<Claim> findByInsurancePolicy_Id(int insurance_policy_id);
}
