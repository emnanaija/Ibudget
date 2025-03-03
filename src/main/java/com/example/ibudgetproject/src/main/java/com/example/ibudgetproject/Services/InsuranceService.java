package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Compensation;
import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Entities.User;
import org.springframework.beans.factory.annotation.Value;
import com.example.ibudgetproject.Repositories.InsuranceRepository;
import com.example.ibudgetproject.Repositories.UserRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;

import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)

public class InsuranceService implements IInsuranceService {


    @Autowired
    private InsuranceRepository insurancePolicyRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public InsurancePolicy createInsurancePolicy(InsurancePolicy insurancePolicy, int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        insurancePolicy.setUser(user);
        return insurancePolicyRepository.save(insurancePolicy);
    }
    @Override
    public InsurancePolicy updateInsurancePolicy(InsurancePolicy insurancePolicy) {

        if (insurancePolicyRepository.existsById(insurancePolicy.getInsurance_policy_id())) {
            return insurancePolicyRepository.save(insurancePolicy);
        } else {
            throw new RuntimeException("InsurancePolicy not found with id: " + insurancePolicy.getInsurance_policy_id());
        }
    }
    @Override
    public void deleteInsurancePolicy(int id) {

        if (insurancePolicyRepository.existsById(id)) {
            insurancePolicyRepository.deleteById(id);
        } else {

            throw new RuntimeException("InsurancePolicy not found with id: " + id);
        }
    }
    @Override
    public InsurancePolicy getInsurancePolicyById(int id) {
        return insurancePolicyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("InsurancePolicy not found with id: " + id));
    }

    @Override
    public List<InsurancePolicy> getAllInsurancePolicies() {
        List<InsurancePolicy> policies = insurancePolicyRepository.findAll();
        if (policies.isEmpty()) {
            throw new RuntimeException("No insurance policies found.");
        }
        return policies;
    }









}
