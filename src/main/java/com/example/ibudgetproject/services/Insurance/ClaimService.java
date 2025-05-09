package com.example.ibudgetproject.services.Insurance;


import com.example.ibudgetproject.entities.Insurance.Claim;
import com.example.ibudgetproject.entities.Insurance.Compensation;
import com.example.ibudgetproject.entities.Insurance.InsurancePolicy;
import com.example.ibudgetproject.repositories.Insurance.ClaimRepository;
import com.example.ibudgetproject.repositories.Insurance.CompensationRepository;
import com.example.ibudgetproject.repositories.Insurance.InsuranceRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class ClaimService implements IClaimService{
    @Autowired
    private ClaimRepository claimRepository ;

    @Autowired
    private InsuranceRepository insuranceRepository ;

    @Autowired
    private CompensationRepository compensationRepository ;

    @Override
    public Claim createClaimForInsurance(int insuranceId, Claim claim) {
        // Vérifier si l'assurance existe
        InsurancePolicy insurancePolicy = insuranceRepository.findById(insuranceId)
                .orElseThrow(() -> new RuntimeException("Insurance policy not found with id: " + insuranceId));

        claim.setInsurancePolicy(insurancePolicy);

        if (insurancePolicy.getUser() == null) {
            throw new IllegalArgumentException("Le claim doit être associé à un utilisateur.");
        }

        long beneficiaryId = insurancePolicy.getUser().getIdUser();

        // Vérifier si une Compensation existe déjà pour ce bénéficiaire
        Compensation compensation = compensationRepository.findByBeneficiaryid(beneficiaryId);

        if (compensation == null) {
            // Créer une nouvelle compensation
            compensation = new Compensation();
            compensation.setBeneficiaryid(beneficiaryId);
            compensation.setAmount_paid(0.0);
            compensation.setPayment_status(false);
            compensation.setPayment_date(LocalDateTime.now());
            compensation.setCoveredClaims(new ArrayList<>());

            // Sauvegarde pour générer un ID
            compensation = compensationRepository.save(compensation);

        }

        // Associer la Compensation au Claim
        claim.setCompensation(compensation);
        compensation.getCoveredClaims().add(claim);

        // Sauvegarder le Claim
        return claimRepository.save(claim);
    }
    @Override
    public void confirmClaim(int claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claimId));

        claim.setExpert_report(true);

        // Si vous voulez créer une compensation automatiquement
        if (claim.getCompensation() == null && claim.getInsurancePolicy() != null
                && claim.getInsurancePolicy().getUser() != null) {
            Compensation compensation = new Compensation();
            compensation.setBeneficiaryid(claim.getInsurancePolicy().getUser().getIdUser());
            compensation.setAmount_paid(claim.getClaimed_amount());
            compensation.setPayment_status(true);
            compensation.setPayment_date(LocalDateTime.now());
            compensation = compensationRepository.save(compensation);

            claim.setCompensation(compensation);
        }

        claimRepository.save(claim);
    }

    @Override
    public void rejectClaim(int claimId) {
        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + claimId));


        claim.setExpert_report(false);
        claimRepository.save(claim);
    }
    @Override
    public Claim updateClaim(Claim claim) {
        if (claimRepository.existsById(claim.getId())) {
            return claimRepository.save(claim);
        } else {
            throw new RuntimeException("Claim not found with id: " + claim.getId());
        }
    }

    @Override
    public void deleteClaim(int id ) {

        if (claimRepository.existsById(id)) {
            claimRepository.deleteById(id);
        } else {

            throw new RuntimeException("Claim not found with id: " + id);
        }

    }

    @Override
    public Claim getClaimByid(int id) {
        return claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));
    }
    @Override
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    @Override
    public List<Claim> getClaimsByInsurance(int insuranceId) {
        return claimRepository.findByInsurancePolicy_Id(insuranceId);


    }



}
