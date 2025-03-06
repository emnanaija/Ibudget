package com.example.ibudgetproject.services.Insurance;


import com.example.ibudgetproject.entities.Insurance.InsurancePolicy;

import java.io.IOException;
import java.util.List;

public interface IInsuranceService {
    InsurancePolicy createInsurancePolicy(InsurancePolicy insurancePolicy, Long userId);
    InsurancePolicy updateInsurancePolicy(InsurancePolicy insurancePolicy);
    void deleteInsurancePolicy(int id);
    InsurancePolicy getInsurancePolicyById(int id);
    List<InsurancePolicy> getAllInsurancePolicies();
    void generateContractPdfToDesktop(InsurancePolicy policy) throws IOException;

}
