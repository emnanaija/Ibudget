package com.example.ibudgetproject.services.Insurance;


import com.example.ibudgetproject.entities.Insurance.InsurancePolicy;
import com.example.ibudgetproject.entities.Insurance.InsuranceStatisticsDTO;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IInsuranceService {
    void activateInsurancePolicy(int id);
    void deactivateInsurancePolicy(int id);



    InsurancePolicy createInsurancePolicy(InsurancePolicy insurancePolicy, int userId);
    InsurancePolicy updateInsurancePolicy(InsurancePolicy updatedPolicy, int userId);
    void deleteInsurancePolicy(int id);
    InsurancePolicy getInsurancePolicyById(int id);
    List<InsurancePolicy> getAllInsurancePolicies();
    void generateContractPdfToDesktop(InsurancePolicy policy) throws IOException;
    String checkSpecialDates(InsurancePolicy policy);
    byte[] generateContractPdfAsBytes(InsurancePolicy policy) throws IOException;
    List<InsurancePolicy> getPoliciesByUserId(int userId);
    String applyOffers(int insuranceId);
    List<InsurancePolicy> getInsurancePoliciesWithOffers();
    Map<String, Long> getInsuranceTypeStatistics();

    InsuranceStatisticsDTO getAllInsuranceStatistics();}
