package com.example.ibudgetproject.services.Savings;
import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.entities.Savings.TauxInteret;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Savings.CompteEpargneRepository;
import com.example.ibudgetproject.repositories.Savings.TauxInteretRepository;
import com.example.ibudgetproject.repositories.User.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.ibudgetproject.entities.User.TypeAccount;
import java.math.BigDecimal;

import java.math.RoundingMode;
import java.util.List;

@Service
public class CompteEpargneService {
    @Autowired
    private CompteEpargneRepository compteEpargneRepository;
    @Autowired
    private TauxInteretRepository tauxInteretRepository;
    @Autowired
    private UserRepository userRepository;

    public List<CompteEpargne> getAllCompteEpargnes() {
        return compteEpargneRepository.findAll();
    }

    public CompteEpargne getCompteEpargneById(Long id) {
        return compteEpargneRepository.findById(id).orElse(null);
    }

    public CompteEpargne saveCompteEpargne(Long userId, CompteEpargne compteEpargne) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Determine TauxInteret based on User's AccountType
        Long tauxId = (user.getAccountType() == TypeAccount.Fremium) ? 1L : 2L;
        TauxInteret tauxInteret = tauxInteretRepository.findById(tauxId)
                .orElseThrow(() -> new RuntimeException("Taux d'intérêt introuvable"));

        compteEpargne.setTauxInteret(tauxInteret);
        compteEpargne.setUser(user); // Set the user object
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
