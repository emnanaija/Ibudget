package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.InsurancePolicy;

import java.util.List;

public interface IInsuranceService {
    InsurancePolicy createInsurancePolicy(InsurancePolicy insurancePolicy, int userId);
    InsurancePolicy updateInsurancePolicy(InsurancePolicy insurancePolicy);
    void deleteInsurancePolicy(int id);
    InsurancePolicy getInsurancePolicyById(int id);
    List<InsurancePolicy> getAllInsurancePolicies();

}
