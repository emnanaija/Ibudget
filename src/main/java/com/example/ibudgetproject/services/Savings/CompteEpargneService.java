package com.example.ibudgetproject.services.Savings;
import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.entities.Savings.TauxInteret;
import com.example.ibudgetproject.repositories.Savings.CompteEpargneRepository;
import com.example.ibudgetproject.repositories.Savings.TauxInteretRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;

import java.math.RoundingMode;
import java.util.List;

@Service
public class CompteEpargneService {
    @Autowired
    private CompteEpargneRepository compteEpargneRepository;
    @Autowired
    private TauxInteretRepository tauxInteretRepository;

    public List<CompteEpargne> getAllCompteEpargnes() {
        return compteEpargneRepository.findAll();
    }

    public CompteEpargne getCompteEpargneById(Long id) {
        return compteEpargneRepository.findById(id).orElse(null);
    }

    public CompteEpargne saveCompteEpargne(CompteEpargne compteEpargne) {
        if (compteEpargne.getTauxInteret() != null && compteEpargne.getTauxInteret().getId() != null) {
            TauxInteret tauxExistant = tauxInteretRepository.findById(compteEpargne.getTauxInteret().getId())
                    .orElseThrow(() -> new RuntimeException("Taux introuvable"));
            compteEpargne.setTauxInteret(tauxExistant);
        }
        return compteEpargneRepository.save(compteEpargne);
    }
    public CompteEpargne updateCompteEpargne(Long id, CompteEpargne updatedCompteEpargne) {
        CompteEpargne existingCompteEpargne = compteEpargneRepository.findById(id).orElse(null);
        if (existingCompteEpargne != null) {

            existingCompteEpargne.setSolde(updatedCompteEpargne.getSolde());
            return compteEpargneRepository.save(existingCompteEpargne);
        }
        return null;
    }
    public void deleteCompteEpargne(Long id) {
        compteEpargneRepository.deleteById(id);
    }
    // Associer un taux d'intérêt à un compte épargne
    public CompteEpargne associerTauxInteret(Long compteId, Long tauxInteretId) {
        CompteEpargne compte = compteEpargneRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte épargne non trouvé"));
        TauxInteret tauxInteret = tauxInteretRepository.findById(tauxInteretId)
                .orElseThrow(() -> new RuntimeException("Taux d'intérêt non trouvé"));
        compte.setTauxInteret(tauxInteret);
        return compteEpargneRepository.save(compte);
    }

    // Méthode pour calculer le montant avec intérêts
    public BigDecimal calculerMontantAvecInterets(Long compteId, int dureeEnMois) {
        CompteEpargne compte = compteEpargneRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte épargne non trouvé"));
        if (compte.getTauxInteret() == null) {
            throw new RuntimeException("Aucun taux d'intérêt associé à ce compte.");
        }
        BigDecimal tauxInteret = compte.getTauxInteret().getTaux();
        BigDecimal montantInitial = compte.getSolde();
        BigDecimal dureeAnnee = BigDecimal.valueOf(dureeEnMois).divide(BigDecimal.valueOf(12), RoundingMode.HALF_UP);
        BigDecimal montantAvecInterets = montantInitial.multiply(BigDecimal.ONE.add(tauxInteret).pow(dureeAnnee.intValue()));
        return montantAvecInterets.setScale(2, RoundingMode.HALF_UP);
    }
}
