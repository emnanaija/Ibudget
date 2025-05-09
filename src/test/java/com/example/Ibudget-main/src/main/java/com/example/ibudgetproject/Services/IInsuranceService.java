package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.InsurancePolicy;

import java.io.IOException;
import java.util.List;

public interface IInsuranceService {
    InsurancePolicy createInsurancePolicy(InsurancePolicy insurancePolicy, int userId);
    InsurancePolicy updateInsurancePolicy(InsurancePolicy updatedPolicy, int userId);
    void deleteInsurancePolicy(int id);
    InsurancePolicy getInsurancePolicyById(int id);
    List<InsurancePolicy> getAllInsurancePolicies();
    void generateContractPdfToDesktop(InsurancePolicy policy) throws IOException;
    String checkSpecialDates(InsurancePolicy policy);

    String applyOffers(int insuranceId);
    List<InsurancePolicy> getInsurancePoliciesWithOffers();
}
