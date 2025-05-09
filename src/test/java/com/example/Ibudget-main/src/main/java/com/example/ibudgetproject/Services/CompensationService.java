package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Claim;
import com.example.ibudgetproject.Entities.Compensation;
import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Entities.User;
import com.example.ibudgetproject.Repositories.ClaimRepository;
import com.example.ibudgetproject.Repositories.CompensationRepository;
import com.example.ibudgetproject.Repositories.InsuranceRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class CompensationService implements ICompensationService{
    @Autowired
    private CompensationRepository compensationRepository ;
    @Autowired
    private InsuranceRepository insurancePolicyRepository;

    @Autowired
    private ClaimRepository claimRepository;


    @Override
    public Compensation createCompensation(Compensation compensation) {



        return compensationRepository.save(compensation);
    }

    @Override
    public Compensation updateCompensation(Compensation compensation) {
        if (compensationRepository.existsById(compensation.getId())) {
            return compensationRepository.save(compensation);
        } else {
            throw new RuntimeException("Compensation not found with id: " + compensation.getId());
        }
    }

    @Override
    public void deleteCompensation(int id ) {

        if (compensationRepository.existsById(id)) {
            compensationRepository.deleteById(id);
        } else {

            throw new RuntimeException("Compensation not found with id: " + id);
        }

    }

    @Override
    public Compensation getCompensationByid(int id) {
        Compensation compensation = compensationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compensation not found with id: " + id));

        // Filtrer les claims avec expert_report = true
        List<Claim> validClaims = compensation.getCoveredClaims().stream()
                .filter(Claim::isExpert_report)
                .collect(Collectors.toList());

        if (!validClaims.isEmpty()) {
            Compensation calculatedCompensation = calculateCompensation(validClaims);
            calculatedCompensation.setId(compensation.getId()); // Garder l'ID de la compensation existante
            compensation = compensationRepository.save(calculatedCompensation); // Sauvegarder calculatedCompensation
        }

        return compensation;
    }

    @Override
    public List<Compensation> getAllCompensations() {
        return compensationRepository.findAll();
    }

    public Compensation calculateCompensation(List<Claim> claims) {
        // Pas besoin de grouper par police

        double totalPaidAmount = 0;
        User beneficiary = null;

        for (Claim claim : claims) {
            InsurancePolicy policy = claim.getInsurancePolicy();

            if ( claim.isExpert_report()) {
                double claimPaidAmount = calculatePolicyCompensation(policy, List.of(claim)); // Calculer pour chaque réclamation
                totalPaidAmount += claimPaidAmount;

                if (beneficiary == null) {
                    beneficiary = policy.getUser();
                }
            }
        }

        Compensation compensation = new Compensation();
        compensation.setAmount_paid(totalPaidAmount);
        compensation.setPayment_date(LocalDateTime.now());
        compensation.setPayment_method("Bank Transfer");
        compensation.setPayment_status(true);
        compensation.setBeneficiaryid(beneficiary.getIdUser());
        compensation.setComment("Compensation calculated based on claims and policies.");
        compensation.setCoveredClaims(claims);

        return compensation;
    }
    private Map<InsurancePolicy, List<Claim>> groupByPolicy(List<Claim> claims) {
        Map<InsurancePolicy, List<Claim>> claimsByPolicy = new HashMap<>();
        for (Claim claim : claims) {
            InsurancePolicy policy = claim.getInsurancePolicy();
            claimsByPolicy.computeIfAbsent(policy, k -> new java.util.ArrayList<>()).add(claim);
        }
        return claimsByPolicy;
    }
    private double calculatePolicyCompensation(InsurancePolicy policy, List<Claim> claims) {
        if (policy == null) {
            throw new IllegalArgumentException("La police d'assurance ne peut pas être nulle.");
        }
        if (claims == null) {
            throw new IllegalArgumentException("La liste des réclamations ne peut pas être nulle.");
        }

        double totalClaimAmount = 0;
        for (Claim claim : claims) {
            if (claim != null && claim.isExpert_report()) { // Condition de date supprimée
                totalClaimAmount += claim.getClaimed_amount();
            }
        }

        if (totalClaimAmount < 0) {
            throw new ArithmeticException("Le montant total des réclamations ne peut pas être négatif.");
        }
        double paidAmount = (totalClaimAmount * policy.getPremium()) / 100;
        if (paidAmount < 0) {
            throw new ArithmeticException("Le montant payé ne peut pas être négatif.");
        }
        paidAmount = Math.max(0, paidAmount - policy.getDeductible());
        paidAmount = Math.min(paidAmount, calculateCoverageLimit(policy));
        InsurancePolicy.PaymentFrequency frequency = policy.getFrequency();
        switch (frequency) {
            case ANNUAL:
                paidAmount *= 1.1; // Exemple : 10% de plus pour une fréquence annuelle
                break;
            case SEMIANNUAL:
                paidAmount *= 1.05; // Exemple : 5% de plus pour une fréquence semestrielle
                break;
            case QUARTERLY:
                paidAmount *= 1.02; // Exemple : 2% de plus pour une fréquence trimestrielle
                break;
            case MONTHLY:
                // Pas d'ajustement
                break;
            case WEEKLY:
                paidAmount *= 0.98; // Exemple : 2% de moins pour une fréquence hebdomadaire
                break;
            case ONCE:
                // Pas d'ajustement
                break;
            default:
                // Pas d'ajustement
                break;
        }
        if (paidAmount < 0) {
            throw new ArithmeticException("Le montant payé ne peut pas être négatif.");
        }
        return paidAmount;
    }
    @Override
    public double calculateClaimProbability(Claim claim, InsurancePolicy policy) {
        // Exemple simplifié : Probabilité basée sur le type d'assurance et le montant réclamé
        double baseProbability = 0.1; // Probabilité de base
        if (policy.getInsurance_type() == InsurancePolicy.InsuranceType.CAR) {
            baseProbability += 0.05;
        }
        if (claim.getClaimed_amount() > 10000) {
            baseProbability += 0.03;
        }
        return Math.min(baseProbability, 0.9); // Probabilité maximale de 90%
    }





    public double calculateCoverageLimit(InsurancePolicy policy) {
        // Exemple : Plafond de couverture basé sur le type d'assurance et le montant de la prime
        switch (policy.getInsurance_type()) {
            case CAR:
                return policy.getPremium() * 50;
            case HOME:
                return policy.getPremium() * 100;
            case HEALTH:
                return policy.getPremium() * 200;
            default:
                return policy.getPremium() * 75;
        }
    }

    public void sendCompensationSms(Compensation compensation, User user) {


         String accountSid = "ACb65e44c3e078d2e73b833e4dcb25007a"; // Initialisation directe
         String authToken = "c53c4a301803fe75bc81f49fd4c172c0"; // Initialisation directe
         String twilioPhoneNumber = "+121653946055"; // Initialisation directe
        Twilio.init(accountSid, authToken);

        String messageBody = "Votre compensation de " + compensation.getAmount_paid() + " a été traitée.";
        PhoneNumber to = new PhoneNumber("+53946055");  // <- Numéro statique

        PhoneNumber from = new PhoneNumber(twilioPhoneNumber);
        Message message = Message.creator(to, from, messageBody).create();

        System.out.println("SMS envoyé avec succès : " + message.getSid());
    }

}

