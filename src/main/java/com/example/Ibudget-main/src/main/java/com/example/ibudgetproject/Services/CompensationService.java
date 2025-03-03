package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.Claim;
import com.example.ibudgetproject.Entities.Compensation;
import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Repositories.ClaimRepository;
import com.example.ibudgetproject.Repositories.CompensationRepository;
import com.example.ibudgetproject.Repositories.InsuranceRepository;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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
        return compensationRepository.save(compensation) ;
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
        return compensationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compensation not found with id: " + id));
    }

    @Override
    public List<Compensation> getAllCompensations() {
        return compensationRepository.findAll();
    }





    public Compensation processCompensation(Integer policyId) {
        // Récupérer le contrat d'assurance
        InsurancePolicy policy = insurancePolicyRepository.findById(policyId)
                .orElseThrow(() -> new RuntimeException("Contrat non trouvé !"));

        // Récupérer la prime payée
        double premium = policy.getPremium();

        // Récupérer tous les sinistres validés
        List<Claim> validClaims = policy.getClaims().stream()
                .filter(claim -> Boolean.TRUE.equals(claim.isClaim_status())) // On garde ceux avec claim_status == true
                .collect(Collectors.toList());

        if (validClaims.isEmpty()) {
            throw new RuntimeException("Aucun sinistre validé pour ce contrat !");
        }

        // Calculer la somme des claimed_amount
        double totalClaimedAmount = validClaims.stream()
                .mapToDouble(Claim::getClaimed_amount)
                .sum();

        // Déterminer le taux de couverture en fonction de la prime
        double coverageRate = Math.min(1, 0.5 + (premium / 5000));

        // Calculer le montant à payer
        double amountPaid = totalClaimedAmount * coverageRate;

        // Créer la compensation
        Compensation compensation = new Compensation();
        compensation.setAmount_paid(amountPaid);
        compensation.setPayment_date(LocalDateTime.now());
        compensation.setPayment_status(false); // En attente de paiement
        compensation.setCoveredClaims(validClaims); // Associer les sinistres à cette compensation

        // Associer la compensation aux sinistres
        for (Claim claim : validClaims) {
            claim.setCompensation(compensation);
        }

        // Sauvegarder les sinistres mis à jour
        claimRepository.saveAll(validClaims);

        // Sauvegarder la compensation
        return compensationRepository.save(compensation);
    }

}
