package com.example.ibudgetproject.controllers.Insurance;


import com.example.ibudgetproject.entities.Insurance.InsurancePolicy;
import com.example.ibudgetproject.entities.Insurance.InsuranceStatisticsDTO;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.User.UserRepository;
import com.example.ibudgetproject.services.Insurance.IGeminiService;
import com.example.ibudgetproject.services.Insurance.IInsuranceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
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


    @PutMapping("/activate/{id}")
    public ResponseEntity<String> activateInsurance(@PathVariable int id) {
        try {
            insurancePolicyService.activateInsurancePolicy(id);
            return ResponseEntity.ok("Insurance policy activated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/deactivate/{id}")
    public ResponseEntity<String> deactivateInsurance(@PathVariable int id) {
        try {
            insurancePolicyService.deactivateInsurancePolicy(id);
            return ResponseEntity.ok("Insurance policy deactivated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
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

    @GetMapping("/list/user/{userId}")
    public List<InsurancePolicy> getPoliciesByUser(@PathVariable int userId) {
        return insurancePolicyService.getPoliciesByUserId(userId);
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

    @GetMapping("/download/{contractId}")
    public ResponseEntity<byte[]> downloadContract(@PathVariable int contractId) throws IOException {
        InsurancePolicy policy = insurancePolicyService.getInsurancePolicyById(contractId);
        byte[] pdfBytes = insurancePolicyService.generateContractPdfAsBytes(policy);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("contract-" + contractId + ".pdf")
                .build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }





    @GetMapping("/by-type")
    public ResponseEntity<Map<String, Long>> getPoliciesByType() {
        return ResponseEntity.ok(insurancePolicyService.getInsuranceTypeStatistics());
    }

    @GetMapping("/all")
    public ResponseEntity<InsuranceStatisticsDTO> getAllStatistics() {
        return ResponseEntity.ok(insurancePolicyService.getAllInsuranceStatistics());
    }

    @PostMapping("/special-date-notification/{userId}")
    public ResponseEntity<String> testSpecialDateNotification(@PathVariable int userId, @RequestBody InsurancePolicy testPolicy) {
        try {
            User user = userRepository.findById((long) userId)
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


    @GetMapping("/preview/{contractId}")
    public ResponseEntity<byte[]> previewContract(@PathVariable int contractId) throws IOException {
        InsurancePolicy policy = insurancePolicyService.getInsurancePolicyById(contractId);
        byte[] pdfBytes = insurancePolicyService.generateContractPdfAsBytes(policy);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
    @PostMapping("/offer-notifications/{userId}")
    public ResponseEntity<String> testOfferNotifications(@PathVariable int userId, @RequestBody InsurancePolicy testPolicy) {
        try {
            // Récupérer l'utilisateur à partir de l'ID
            User user = userRepository.findById((long) userId)
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
