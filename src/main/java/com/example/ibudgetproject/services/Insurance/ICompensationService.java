package com.example.ibudgetproject.services.Insurance;



import com.example.ibudgetproject.entities.Insurance.Claim;
import com.example.ibudgetproject.entities.Insurance.Compensation;
import com.example.ibudgetproject.entities.Insurance.InsurancePolicy;

import java.util.List;
public interface ICompensationService {


    Compensation createCompensation(Compensation compensation) ;
    Compensation updateCompensation(Compensation compensation);
    void deleteCompensation(int id) ;
    Compensation getCompensationByid(int id) ;
    List<Compensation> getAllCompensations() ;
    double calculateClaimProbability(Claim claim, InsurancePolicy policy);


    Compensation getCompensationByBeneficiaryId(long beneficiaryId);
}
