package com.example.ibudgetproject.services.Savings;
import com.example.ibudgetproject.DTO.Savings.PlanEpargneDTO;
import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.entities.Savings.Depot;
import com.example.ibudgetproject.entities.Savings.Objectif;
import com.example.ibudgetproject.repositories.Savings.CompteEpargneRepository;
import com.example.ibudgetproject.repositories.Savings.DepotRepository;
import com.example.ibudgetproject.repositories.Savings.ObjectifRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;


@Service
public class ObjectifService {
    @Autowired
    private ObjectifRepository objectifRepository;
    @Autowired
    private DepotRepository depotRepository;
    @Autowired
    private CompteEpargneRepository compteEpargneRepository;

    public List<Objectif> getAllObjectifs() {
        return objectifRepository.findAll();
    }

    public Objectif getObjectifById(Long id) {
        return objectifRepository.findById(id).orElse(null);
    }

    public Objectif saveObjectif(Objectif objectif) {
        // Vérifier que l'objectif est bien lié à un compte épargne
        if (objectif.getCompteEpargne() == null) {
            throw new RuntimeException("L'objectif doit être lié à un compte épargne.");
        }

        // Récupérer le compte épargne en utilisant son ID
        CompteEpargne compteEpargne = compteEpargneRepository.findById(objectif.getCompteEpargne().getId())
                .orElseThrow(() -> new RuntimeException("Compte épargne non trouvé"));

        // Vérifier que le taux d'intérêt est bien conservé
        if (compteEpargne.getTauxInteret() != null) {
            System.out.println("Taux d'intérêt avant la création de l'objectif : " + compteEpargne.getTauxInteret().getTaux());
        }

        // Lier le compte épargne à l'objectif
        objectif.setCompteEpargne(compteEpargne);

        Objectif savedObjectif = objectifRepository.save(objectif);

        // Vérifier que le taux d'intérêt n'a pas été modifié
        if (savedObjectif.getCompteEpargne().getTauxInteret() != null) {
            System.out.println("Taux d'intérêt après la création de l'objectif : " + savedObjectif.getCompteEpargne().getTauxInteret().getTaux());
        }

        return savedObjectif;
    }
    public Objectif updateObjectif(Long id, Objectif updatedObjectif) {
        Objectif existingObjectif = objectifRepository.findById(id).orElse(null);
        if (existingObjectif != null) {

            existingObjectif.setNom(updatedObjectif.getNom());
            existingObjectif.setMontantObjectif(updatedObjectif.getMontantObjectif());
            existingObjectif.setDateEstimee(updatedObjectif.getDateEstimee());
            existingObjectif.setCompteEpargne(updatedObjectif.getCompteEpargne());


            return objectifRepository.save(existingObjectif);
        }
        return null;
    }
    public void deleteObjectif(Long id) {
        objectifRepository.deleteById(id);
    }

    /**
     * Estime la date d’atteinte de l’objectif et propose un dépôt optimal.
     */
    public PlanEpargneDTO estimerPlanEpargne(Long objectifId) {
        Objectif objectif = objectifRepository.findById(objectifId)
                .orElseThrow(() -> new RuntimeException("Objectif non trouvé"));

        CompteEpargne compte = objectif.getCompteEpargne();
        BigDecimal soldeActuel = compte.getSolde();
        BigDecimal montantObjectif = objectif.getMontantObjectif();
        BigDecimal tauxInteret = compte.getTauxInteret().getTaux();

        // Calcul de la somme totale des dépôts actifs
        List<Depot> depotsActifs = depotRepository.findByCompteEpargneId(compte.getId());
        BigDecimal totalDepots = depotsActifs.stream()
                .map(Depot::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        // Vérifier si l’objectif est déjà atteint
        if (soldeActuel.add(totalDepots).compareTo(montantObjectif) >= 0) {
            return new PlanEpargneDTO(montantObjectif, LocalDate.now(), "Votre objectif est déjà atteint !");
        }

        // Nombre de mois estimé pour atteindre l'objectif
        int moisNecessaires = 0;
        BigDecimal montantRestant = montantObjectif.subtract(soldeActuel.add(totalDepots));

        // Simulation d’une progression mensuelle en tenant compte des intérêts
        BigDecimal capital = soldeActuel;
        while (capital.compareTo(montantObjectif) < 0) {
            capital = capital.add(totalDepots).multiply(BigDecimal.ONE.add(tauxInteret.divide(BigDecimal.valueOf(12), RoundingMode.HALF_UP)));
            moisNecessaires++;
        }

        // Date estimée
        LocalDate dateEstimee = LocalDate.now().plusMonths(moisNecessaires);

        // Suggestion de dépôt optimal
        BigDecimal depotOptimal = montantRestant.divide(BigDecimal.valueOf(moisNecessaires), RoundingMode.HALF_UP);

        // Création de la réponse DTO
        return new PlanEpargneDTO(montantObjectif, dateEstimee, "Déposez environ " + depotOptimal + " DT par mois.");
    }

    private boolean estDepotEffectueCeMois(String frequence, LocalDate date) {
        switch (frequence.toLowerCase()) {
            case  "mensuel":
                return true; // Dépôt chaque mois
            case "trimestriel":
                return date.getMonthValue() % 3 == 0; // Dépôt tous les 3 mois
            case "annuel":
                return date.getMonthValue() == 1; // Dépôt en janvier
            default:
                return false;
        }
    }


}
