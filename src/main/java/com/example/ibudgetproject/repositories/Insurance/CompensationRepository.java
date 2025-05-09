package com.example.ibudgetproject.repositories.Insurance;

import com.example.ibudgetproject.entities.Insurance.Compensation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompensationRepository extends JpaRepository<Compensation,Integer> {

    Compensation findByBeneficiaryid(long beneficiaryid);


    @Query("SELECT c FROM Compensation c WHERE c.beneficiaryid = :beneficiaryid ORDER BY c.payment_date DESC LIMIT 1")
    Compensation findLatestByBeneficiaryid(@Param("beneficiaryid") long beneficiaryid);
}

