package com.example.ibudgetproject.services.expenses;

import com.example.ibudgetproject.entities.expenses.Depense;
import com.example.ibudgetproject.entities.expenses.DepenseReccurente;
import com.example.ibudgetproject.entities.expenses.EtatDepense;
import com.example.ibudgetproject.entities.expenses.ExpenseCategory;
import com.example.ibudgetproject.repositories.expenses.DepenseReccurenteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Service
public class DepenseReccurenteService {

    private static final Logger logger = LoggerFactory.getLogger(DepenseReccurenteService.class);

    @Autowired
    private  DepenseReccurenteRepository depenseRecurrenteRepository;

    @Autowired
    private  DepenseService depenseService;


    public DepenseReccurente ajouterDepense(DepenseReccurente depense) {
        return depenseRecurrenteRepository.save(depense);
    }


    public DepenseReccurente modifierDepense(Long id, DepenseReccurente nouvelleDepense) {
        return depenseRecurrenteRepository.findById(id)
                .map(depense -> {
                    depense.setWallet(nouvelleDepense.getWallet());
                    depense.setCategorie(nouvelleDepense.getCategorie());
                    depense.setMontant(nouvelleDepense.getMontant());
                    depense.setDateDebut(nouvelleDepense.getDateDebut());
                    depense.setDateFin(nouvelleDepense.getDateFin());
                    depense.setFrequence(nouvelleDepense.getFrequence());
                    return depenseRecurrenteRepository.save(depense);
                })
                .orElseThrow(() -> new RuntimeException("Dépense récurrente non trouvée"));
    }


    public void supprimerDepense(Long id) {
        depenseRecurrenteRepository.deleteById(id);
    }


    public List<DepenseReccurente> listerDepenses() {
        return depenseRecurrenteRepository.findAll();
    }


    public DepenseReccurente getDepenseById(Long id) {
        return depenseRecurrenteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dépense récurrente non trouvée"));
    }


   //@Scheduled(cron = "0 * * * * ?") // Exécution toutes les minutes
    public void traiterDepensesRecurrentes() {
        logger.info("🔄 Job de traitement des dépenses récurrentes exécuté à {}", LocalDateTime.now());

      //  LocalDate today = LocalDate.now();
        LocalDate today = LocalDate.of(2025, 5, 26); // Simule qu'on est en mai 2025

        List<DepenseReccurente> depensesRecurrentes = depenseRecurrenteRepository.findAll();

        for (DepenseReccurente depense : depensesRecurrentes) {
            if (depenseEncoreValide(depense, today)) {
                LocalDate prochaineDate = depense.getDateDebut();

                while (!prochaineDate.isAfter(today)) {
                    enregistrerDepense(depense, prochaineDate); // 🔥 Ajouter chaque occurrence manquée
                    prochaineDate = calculerProchaineDate(depense, prochaineDate); // Passer à la prochaine date
                }


                depense.setDateDebut(prochaineDate);
                depenseRecurrenteRepository.save(depense);
            }
        }
    }

    private boolean depenseEncoreValide(DepenseReccurente depense, LocalDate today) {
        return !today.isBefore(depense.getDateDebut()) &&
                (depense.getDateFin() == null || !today.isAfter(depense.getDateFin()));
    }

    private void enregistrerDepense(DepenseReccurente depenseRecurrente, LocalDate date) {
        // Création d'une nouvelle dépense à partir de la dépense récurrente
        Depense depense = new Depense();
        depense.setWallet(depenseRecurrente.getWallet());
        depense.setCategory(depenseRecurrente.getCategorie());
        depense.setMontant(depenseRecurrente.getMontant().doubleValue());
        depense.setDate(date);
        depense.setEtat(EtatDepense.REALISEE);  // Assurez-vous que `REALISEE` est une valeur de l'énumération `EtatDepense`


        // Appel de createDepenseManuelle pour gérer l'enregistrement et les mises à jour
       depenseService.createDepenseManuelle(depense);
    }



    private LocalDate calculerProchaineDate(DepenseReccurente depense, LocalDate lastOccurrence) {
        switch (depense.getFrequence()) {
            case HEBDOMADAIRE:
                return lastOccurrence.plusWeeks(1);
            case MENSUELLE:
                return lastOccurrence.plusMonths(1);
            case TRIMESTRIELLE:
                return lastOccurrence.plusMonths(3);
            case SEMESTRIELLE:
                return lastOccurrence.plusMonths(6);
            case ANNUELLE:
                return lastOccurrence.plusYears(1);
            default:
                throw new IllegalArgumentException("Fréquence non reconnue");
        }
    }

    public Map<ExpenseCategory, Double> calculerTotalMontantParCategorie() {
        // Récupérer toutes les dépenses récurrentes
        List<DepenseReccurente> depensesRecurrentes = depenseRecurrenteRepository.findAll();

        // Créer une map pour stocker le total des montants par catégorie
        Map<ExpenseCategory, Double> totalMontantParCategorie = new HashMap<>();

        // Parcourir les dépenses récurrentes et calculer le total par catégorie
        for (DepenseReccurente depense : depensesRecurrentes) {
            ExpenseCategory categorie = depense.getCategorie();
            Double montant = depense.getMontant().doubleValue(); // Conversion au cas où le montant est un BigDecimal

            // Ajouter au total existant pour cette catégorie
            totalMontantParCategorie.put(categorie,
                    totalMontantParCategorie.getOrDefault(categorie, 0.0) + montant);
        }

        return totalMontantParCategorie;

    }



    }
