package com.example.ibudgetproject.repositories.Insurance;

import com.example.ibudgetproject.entities.Insurance.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface InsuranceRepository extends JpaRepository<InsurancePolicy, Integer>  {
    // List<InsurancePolicy> findByUserId(long userId);
    List<InsurancePolicy> findByUser_UserId(int userId);
    @Query("SELECT MAX(CAST(p.policy_number AS long)) FROM InsurancePolicy p")
    Long findMaxPolicyNumberAsLong();


    @Query("SELECT i.insurance_type, COUNT(i) FROM InsurancePolicy i GROUP BY i.insurance_type")
    List<Object[]> countPoliciesByType();


    // Dans InsuranceRepository.java
    @Query("SELECT COUNT(i) FROM InsurancePolicy i WHERE i.status = :status")
    Long countByStatus(String status);

    @Query("SELECT AVG(i.premium) FROM InsurancePolicy i")
    Optional<Double> getAveragePremium();

    @Query("SELECT SUM(i.premium) FROM InsurancePolicy i")
    Optional<Double> getTotalPremium();
}

