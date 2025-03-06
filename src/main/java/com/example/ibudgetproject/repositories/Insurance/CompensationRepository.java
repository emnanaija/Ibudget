package com.example.ibudgetproject.repositories.Insurance;

import com.example.ibudgetproject.entities.Insurance.Compensation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompensationRepository extends JpaRepository<Compensation,Integer> {

    Compensation findByBeneficiaryid(long beneficiaryid);
}
