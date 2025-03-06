package com.example.ibudgetproject.controllers.Insurance;


import com.example.ibudgetproject.entities.Insurance.InsurancePolicy;
import com.example.ibudgetproject.services.Insurance.IGeminiService;
import com.example.ibudgetproject.services.Insurance.IInsuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("insurance")
public class InsuranceController {
    @Autowired
    private IInsuranceService insurancePolicyService;
    @Autowired
    IGeminiService geminiService ;

    @PostMapping("/add/{userId}")
    public ResponseEntity<InsurancePolicy> addInsurance(@RequestBody InsurancePolicy insurancePolicy, @PathVariable Long userId) {
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


    @GetMapping("/test-extract-premium/{insuranceId}")
    public double testExtractPremium(@PathVariable int insuranceId) {

        InsurancePolicy insurancePolicy = insurancePolicyService.getInsurancePolicyById(insuranceId);


        String geminiResponse = "Le prix est de 1234.56 euros pour l'assurance " + insuranceId;


        return geminiService.extractPremiumFromText(geminiResponse);
    }

    @GetMapping("/generate/{contractId}")
    public ResponseEntity<String> generateContract(@PathVariable int contractId) {
        try {
            InsurancePolicy policy = insurancePolicyService.getInsurancePolicyById(contractId);
            if (policy == null) {
                return new ResponseEntity<>("Contrat non trouvé", HttpStatus.NOT_FOUND);
            }

            insurancePolicyService.generateContractPdfToDesktop(policy); // Appel de la méthode qui génère sur le bureau

            return new ResponseEntity<>("PDF généré sur le bureau.", HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Erreur lors de la génération du PDF.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
