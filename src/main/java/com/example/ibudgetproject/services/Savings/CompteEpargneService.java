package com.example.ibudgetproject.services.Savings;
import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.entities.Savings.TauxInteret;
import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Savings.CompteEpargneRepository;
import com.example.ibudgetproject.repositories.Savings.TauxInteretRepository;
import com.example.ibudgetproject.repositories.Transactions.SimCardAccountRepository;
import com.example.ibudgetproject.repositories.User.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
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
    @Autowired
    private SimCardAccountRepository simCardAccountRepository;

    public List<CompteEpargne> getAllCompteEpargnes() {
        return compteEpargneRepository.findAll();
    }

    public CompteEpargne getCompteEpargneById(Long id) {
        return compteEpargneRepository.findById(id).orElse(null);
    }

    public CompteEpargne saveCompteEpargne(Long userId,CompteEpargne compteEpargne,Long simCardId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        // Vérifier si la carte SIM existe
        SimCardAccount simCardAccount = simCardAccountRepository.findById(simCardId)
                .orElseThrow(() -> new RuntimeException("Carte SIM introuvable"));
        if (compteEpargne.getTauxInteret() != null && compteEpargne.getTauxInteret().getId() != null) {
            TauxInteret tauxExistant = tauxInteretRepository.findById(compteEpargne.getTauxInteret().getId())
                    .orElseThrow(() -> new RuntimeException("Taux introuvable"));
            compteEpargne.setTauxInteret(tauxExistant);
        }else {
            // Déterminer le taux d'intérêt en fonction du TypeAccount si aucun taux n'a été fourni
            Long tauxId = (user.getAccountType() == TypeAccount.Fremium) ? 1L : 2L;
            TauxInteret tauxInteret = tauxInteretRepository.findById(tauxId)
                    .orElseThrow(() -> new RuntimeException("Taux d'intérêt introuvable"));
            compteEpargne.setTauxInteret(tauxInteret);
        }
        // Vérifier que le solde ne dépasse pas le balance de la carte SIM
        if (compteEpargne.getSolde().doubleValue() > simCardAccount.getBalance()) {
            throw new RuntimeException("Le solde du compte épargne ne peut pas dépasser le solde de la carte SIM.");
        }
        // Associer le compte à l'utilisateur
        compteEpargne.setUser(user);
        return compteEpargneRepository.save(compteEpargne);
    }
    @Scheduled(fixedRate = 30000) // Toutes les 5 minutes (300 000 ms)
    @Transactional
    public void verifierEtMettreAJourTauxInteret() {
        List<User> utilisateurs = userRepository.findAll(); // Récupérer tous les utilisateurs

        for (User user : utilisateurs) {
            Long tauxId = (user.getAccountType() == TypeAccount.Fremium) ? 1L : 2L;
            TauxInteret nouveauTaux = tauxInteretRepository.findById(tauxId)
                    .orElseThrow(() -> new RuntimeException("Taux introuvable"));

            // Récupérer tous les comptes épargne de l'utilisateur
            List<CompteEpargne> comptes = compteEpargneRepository.findByUser(user);

            for (CompteEpargne compte : comptes) {
                if (!compte.getTauxInteret().getId().equals(tauxId)) {
                    compte.setTauxInteret(nouveauTaux);
                    compteEpargneRepository.save(compte); // Mise à jour en base
                }
            }
        }
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
