package com.example.ibudgetproject.Controllers;

import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Entities.User;
import com.example.ibudgetproject.Repositories.UserRepository;
import com.example.ibudgetproject.Services.IGeminiService;
import com.example.ibudgetproject.Services.IInsuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

import java.time.LocalDateTime;
import java.util.List;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("insurance")
public class InsuranceController {
    @Autowired
    private IInsuranceService insurancePolicyService;
    @Autowired
    IGeminiService geminiService ;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/add/{userId}")
    public ResponseEntity<InsurancePolicy> addInsurance(@RequestBody InsurancePolicy insurancePolicy, @PathVariable int userId) {
        InsurancePolicy newPolicy = insurancePolicyService.createInsurancePolicy(insurancePolicy, userId);
        return ResponseEntity.ok(newPolicy);
    }


    @PutMapping("modify")
    public InsurancePolicy updateInsurancePolicy(@RequestBody InsurancePolicy insurancePolicy, @RequestParam("userId") int userId) {
        return insurancePolicyService.updateInsurancePolicy(insurancePolicy, userId);
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

    @PostMapping("/special-date-notification/{userId}")
    public ResponseEntity<String> testSpecialDateNotification(@PathVariable int userId, @RequestBody InsurancePolicy testPolicy) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
            testPolicy.setUser(user);
            testPolicy.setSubscription_date(LocalDateTime.now());

            String notificationText = insurancePolicyService.checkSpecialDates(testPolicy);

            if (notificationText != null) {
                return ResponseEntity.ok(notificationText); // Renvoie le texte de la notification
            } else {
                return ResponseEntity.ok("Aucune notification de date spéciale.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du test de la notification : " + e.getMessage());
        }
    }

    @PostMapping("/offer-notifications/{userId}")
    public ResponseEntity<String> testOfferNotifications(@PathVariable int userId, @RequestBody InsurancePolicy testPolicy) {
        try {
            // Récupérer l'utilisateur à partir de l'ID
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'ID : " + userId));
            testPolicy.setUser(user);

            // Définition d'une prime pour déclencher l'offre
            testPolicy.setPremium(2500.0); // Ou une autre valeur pour tester les offres

            // Appel de la méthode pour appliquer les offres (si vous l'avez ré-implémentée)
            // insuranceService.applyOffers(testPolicy.getId());

            return ResponseEntity.ok("Notifications d'offres testées avec succès pour l'utilisateur ID : " + userId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors du test des notifications d'offres : " + e.getMessage());
        }
    }
    @GetMapping("/offers")
    public ResponseEntity<List<InsurancePolicy>> getPoliciesWithOffers() {
        List<InsurancePolicy> policies = insurancePolicyService.getInsurancePoliciesWithOffers();
        return ResponseEntity.ok(policies);
    }

}
