package com.example.ibudgetproject.Controllers;

import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Services.IGeminiService;
import com.example.ibudgetproject.Services.IInsuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("insurance")
public class InsuranceController {
    @Autowired
    private IInsuranceService insurancePolicyService;
    @Autowired
    IGeminiService geminiService ;

    @PostMapping("/add/{userId}")
    public ResponseEntity<InsurancePolicy> addInsurance(@RequestBody InsurancePolicy insurancePolicy, @PathVariable int userId) {
        InsurancePolicy newPolicy = insurancePolicyService.createInsurancePolicy(insurancePolicy, userId);
        return ResponseEntity.ok(newPolicy);
    }


    @PutMapping("modify")
    public InsurancePolicy updateInsurancePolicy(@RequestBody InsurancePolicy insurancePolicy) {
        return insurancePolicyService.updateInsurancePolicy(insurancePolicy);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteInsurancePolicy(@PathVariable int id) {
        insurancePolicyService.deleteInsurancePolicy(id);
    }

    @GetMapping("/getbyid/{id}")
    public InsurancePolicy getInsurancePolicyById(@PathVariable int id) {
        return insurancePolicyService.getInsurancePolicyById(id);
    }

    @GetMapping("/list")
    public List<InsurancePolicy> getAllInsurancePolicies() {
        return insurancePolicyService.getAllInsurancePolicies();
    }


    @GetMapping("/calculate-premium/{id}")
    public double calculatePremium(
            @PathVariable int id
    ) {
        return geminiService.calculatePremium(id);
    }



}
