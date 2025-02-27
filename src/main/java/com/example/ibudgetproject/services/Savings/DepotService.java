package com.example.ibudgetproject.services.Savings;
import com.example.ibudgetproject.entities.Savings.Depot;
import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.entities.Savings.DepotLog;
import com.example.ibudgetproject.repositories.Savings.DepotRepository;
import com.example.ibudgetproject.repositories.Savings.DepotLogRepository;
import com.example.ibudgetproject.repositories.Savings.CompteEpargneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.RoundingMode;
import java.util.Calendar;
import java.util.List;
import java.util.Date;
import java.math.BigDecimal;


@Service
public class DepotService {
    @Autowired
    private DepotRepository depotRepository;
    @Autowired
    private CompteEpargneRepository compteEpargneRepository;
    @Autowired
    private DepotLogRepository depotLogRepository;
    // ➜ Ajouter un dépôt
    public Depot saveDepot(Depot depot) {
        if (depot.getCompteEpargne() == null) {
            throw new RuntimeException("Le dépôt doit être lié à un compte épargne.");
        }
        if (depot.getMontant() == null || depot.getMontant().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Le montant du dépôt doit être supérieur à zéro.");
        }
        CompteEpargne compte = compteEpargneRepository.findById(depot.getCompteEpargne().getId())
                .orElseThrow(() -> new RuntimeException("Compte épargne introuvable"));
        System.out.println("Avant dépôt : Solde = " + compte.getSolde() +
                ", Taux d'intérêt = " + (compte.getTauxInteret() != null ? compte.getTauxInteret().getTaux() : "NULL"));

        depot.setCompteEpargne(compte);
        depot.setprochainDepot(calculerDateProchainDepot(depot.getFrequenceDepot(),depot.getDateDepot()));
        Depot savedDepot = depotRepository.save(depot);
        compteEpargneRepository.save(compte);
        System.out.println("Après dépôt : Solde = " + compte.getSolde() +
                ", Taux d'intérêt = " + (compte.getTauxInteret() != null ? compte.getTauxInteret().getTaux() : "NULL"));
        updateMontantDepotRecu(depot.getCompteEpargne());
        return savedDepot;
    }

    // ➜ Récupérer tous les dépôts
    public List<Depot> getAllDepots() {
        return depotRepository.findAll();
    }

    // ➜ Récupérer un dépôt par ID
    public Depot getDepotById(Long id) {
        return depotRepository.findById(id).orElse(null);
    }

    // ➜ Mettre à jour un dépôt
    public Depot updateDepot(Long id, Depot updatedDepot) {
        Depot existingDepot = depotRepository.findById(id).orElse(null);
        if (existingDepot != null) {
            existingDepot.setMontant(updatedDepot.getMontant());
            existingDepot.setDateDepot(updatedDepot.getDateDepot());
            existingDepot.setFrequenceDepot(updatedDepot.getFrequenceDepot());
            return depotRepository.save(existingDepot);
        }
        return null;
    }

    // ➜ Supprimer un dépôt
    public void deleteDepot(Long id) {
        Depot depot = depotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dépôt non trouvé"));
        CompteEpargne compte = depot.getCompteEpargne();
        DepotLog depotLog = new DepotLog(
                depot.getCompteEpargne(),
                depot.getMontant(),
                depot.getFrequenceDepot(),
                depot.getDateDepot()
        );
        depotLogRepository.save(depotLog);
        depotRepository.delete(depot);
        updateMontantDepotRecu(compte);
    }

    // ➜ Mettre à jour le total des dépôts reçus pour un compte épargne
    private void updateMontantDepotRecu(CompteEpargne compteEpargne) {
        BigDecimal totalDepots = depotRepository.findByCompteEpargne(compteEpargne)
                .stream()
                .map(Depot::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        compteEpargne.setSolde(totalDepots);
        compteEpargneRepository.save(compteEpargne);
    }

    // ➜ Effectuer un dépôt et mettre à jour le solde du compte épargne
    public void effectuerDepot(Depot depot) {
        CompteEpargne compte = depot.getCompteEpargne();
        if (compte == null) {
            throw new RuntimeException("Le dépôt doit être associé à un compte épargne.");
        }
        compte.setSolde(compte.getSolde().add(depot.getMontant()));
        compteEpargneRepository.save(compte);
    }

    // ➜ Simuler un dépôt récurrent avec intérêts
    public BigDecimal simulerDepotsRecurrents(Long compteId, BigDecimal montant, String frequence, int dureeEnMois) {
        CompteEpargne compte = compteEpargneRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte épargne non trouvé"));

        BigDecimal tauxInteret = compte.getTauxInteret().getTaux();
        BigDecimal montantFinal = BigDecimal.ZERO;
// Déterminer l'intervalle des dépôts en fonction de la fréquence
        int intervalleDepot;
        switch (frequence.toLowerCase()) {
            case "trimestriel":
                intervalleDepot = 3; // Dépôt tous les 3 mois
                break;
            case "annuel":
                intervalleDepot = 12; // Dépôt une fois par an
                break;
            case "mensuel":
            default:
                intervalleDepot = 1; // Dépôt chaque mois (par défaut)
                break;
        }

        // Simulation des dépôts récurrents avec intérêts
        for (int mois = 1; mois <= dureeEnMois; mois++) {
            if (mois % intervalleDepot == 0) { // Ajouter le montant seulement si c'est le mois du dépôt
                montantFinal = montantFinal.add(montant);
            }
            montantFinal = montantFinal.multiply(BigDecimal.ONE.add(tauxInteret));
        }

        return montantFinal.setScale(2, RoundingMode.HALF_UP);
    }

    // ➜ Trouver les dépôts récurrents
    public List<Depot> findDepotsRecurrents() {
        return depotRepository.findByFrequenceDepotIsNotNull();
    }

    // ➜ Calculer et stocker la date du prochain dépôt
    public void calculerProchainDepot(Depot depot) {
        Date prochainDepot = calculerDateProchainDepot(depot.getFrequenceDepot(), depot.getprochainDepot());
        depot.setprochainDepot(prochainDepot);
        depotRepository.save(depot);
    }

    // ➜ Déterminer la date du prochain dépôt en fonction de la fréquence
    private Date calculerDateProchainDepot(String frequence, Date dernierDepot) {
        if (dernierDepot == null || frequence == null) {
            throw new IllegalArgumentException("La fréquence et la date du dernier dépôt sont obligatoires.");
        }

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(dernierDepot);

        switch (frequence.toLowerCase()) {
            case "mensuel":
                calendar.add(Calendar.MONTH, 1);
                break;
            case "trimestriel":
                calendar.add(Calendar.MONTH, 3);
                break;
            case "annuel":
                calendar.add(Calendar.YEAR, 1);
                break;
            default:
                throw new IllegalArgumentException("Fréquence de dépôt invalide : " + frequence);
        }
        return calendar.getTime();
    }

}

