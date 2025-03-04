package com.example.ibudgetproject.services;

import com.example.ibudgetproject.DTO.Savings.SimulationResultDTO;
import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.entities.Savings.Depot;
import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.expenses.ExpenseCategory;
import com.example.ibudgetproject.entities.expenses.FluctuationRateProvider;
import com.example.ibudgetproject.repositories.Savings.CompteEpargneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
public class MonteCarloService {

    private static final int NUM_SIMULATIONS = 10000;

    @Autowired
    private AIService aiService;

    public Map<String, Object> predictTransactionVolumes(SimCardAccount account, int numFutureMonths) {
        List<SimTransactions> transactions = account.getTransactions();
        Random random = new Random();
        double[] forecastedVolumes = new double[numFutureMonths];

        Map<String, Object> cleanedDataResult = aiService.cleanData(transactions);
        List<SimTransactions> cleanedTransactions = (List<SimTransactions>) cleanedDataResult.get("cleanedTransactions");
        String cleaningMessage = (String) cleanedDataResult.get("message");


        Map<String, Object> analysisResult = aiService.analyzeTransactionParameters(cleanedTransactions);
        double avgVolume = (double) analysisResult.get("average");
        double stdDevVolume = (double) analysisResult.get("stdDev");
        String analysisMessage = (String) analysisResult.get("message");

        for (int month = 0; month < numFutureMonths; month++) {
            double totalVolume = 0.0;
            for (int i = 0; i < NUM_SIMULATIONS; i++) {
                double simulatedVolume = avgVolume + random.nextGaussian() * stdDevVolume;
                totalVolume += simulatedVolume;
            }
            forecastedVolumes[month] = totalVolume / NUM_SIMULATIONS;
        }

        // 3. AI-Powered Result Interpretation
        Map<String, Object> forecastResult = aiService.analyzeResults(forecastedVolumes);
        String forecastMessage = (String) forecastResult.get("message");

        // Build the response map
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("forecastedVolumes", forecastedVolumes);
        response.put("cleaningMessage", cleaningMessage);
        response.put("analysisMessage", analysisMessage);
        response.put("forecastMessage", forecastMessage);

        return response;
    }

    public double optimizeBudget(SimCardAccount account, double totalBudget) {
        List<SimTransactions> transactions = account.getTransactions();
        Random random = new Random();

        // 1. AI-Powered Data Cleaning
        Map<String, Object> cleanedDataResult = aiService.cleanData(transactions);
        List<SimTransactions> cleanedTransactions = (List<SimTransactions>) cleanedDataResult.get("cleanedTransactions");

        // 2. AI-Powered Parameter Analysis
        Map<String, Object> analysisResult = aiService.analyzeTransactionParameters(cleanedTransactions);
        double avgAmount = (double) analysisResult.get("average");
        double stdDevAmount = (double) analysisResult.get("stdDev");

        // Monte Carlo simulations for budget allocation
        double bestAllocation = 0.0;
        double minVariance = Double.MAX_VALUE;

        for (int i = 0; i < NUM_SIMULATIONS; i++) {
            double allocation = random.nextDouble() * totalBudget;
            double totalSpending = 0.0;

            for (SimTransactions transaction : cleanedTransactions) {
                double simulatedAmount = avgAmount + random.nextGaussian() * stdDevAmount;
                totalSpending += Math.min(simulatedAmount, allocation);
            }

            double variance = Math.pow(totalSpending - totalBudget, 2);
            if (variance < minVariance) {
                minVariance = variance;
                bestAllocation = allocation;
            }
        }

        return bestAllocation;
    }

    // Simulation compte epargne

    @Autowired
    private CompteEpargneRepository compteEpargneRepository;

    private static final int NOMBRE_SIMULATIONS = 1000;

    public SimulationResultDTO simulerMonteCarlo(Long compteId, int dureeAnnees) {
        // Récupérer le compte épargne
        CompteEpargne compte = compteEpargneRepository.findById(compteId)
                .orElseThrow(() -> new RuntimeException("Compte non trouvé"));

        BigDecimal soldeInitial = compte.getSolde().setScale(2, RoundingMode.HALF_UP);
        BigDecimal tauxInteret = compte.getTauxInteret().getTaux().setScale(4, RoundingMode.HALF_UP);

        // Récupérer les dépôts mensuels
        List<Depot> depots = compte.getDepots();
        BigDecimal totalDepotsMensuels = depots.stream()
                .map(Depot::getMontant)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        Random random = new Random();
        List<BigDecimal> simulations = new ArrayList<>();

        // Exécuter plusieurs simulations
        for (int i = 0; i < NOMBRE_SIMULATIONS; i++) {
            BigDecimal solde = soldeInitial;
            LocalDate date = LocalDate.now();

            for (int mois = 0; mois < dureeAnnees * 12; mois++) {
                // Générer une variation aléatoire de l'économie (-3% à +3%)
                BigDecimal variationEconomique = new BigDecimal((random.nextDouble() - 0.5) * 0.06).setScale(4, RoundingMode.HALF_UP);
                BigDecimal tauxInteretEffectif = tauxInteret.add(variationEconomique).setScale(4, RoundingMode.HALF_UP);

                // Ajouter les intérêts du mois
                BigDecimal interets = solde.multiply(tauxInteretEffectif.divide(BigDecimal.valueOf(12), RoundingMode.HALF_UP)) .setScale(2, RoundingMode.HALF_UP);
                solde = solde.add(interets) .setScale(2, RoundingMode.HALF_UP);

                // Ajouter les dépôts mensuels
                solde = solde.add(totalDepotsMensuels) .setScale(2, RoundingMode.HALF_UP);
            }

            simulations.add(solde);
        }

        // Calculer les statistiques sur les résultats
        BigDecimal somme = simulations.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal moyenne = somme.divide(BigDecimal.valueOf(NOMBRE_SIMULATIONS), 2,RoundingMode.HALF_UP);

        simulations.sort(BigDecimal::compareTo);
        BigDecimal intervalleMin = simulations.get((int) (NOMBRE_SIMULATIONS * 0.05));
        BigDecimal intervalleMax = simulations.get((int) (NOMBRE_SIMULATIONS * 0.95));
        List<BigDecimal> simulationsReduites = new ArrayList<>();
        if (simulations.size() >= 4) {
            simulationsReduites.add(simulations.get(0));
            simulationsReduites.add(simulations.get(1));
            simulationsReduites.add(simulations.get(simulations.size() - 2));
            simulationsReduites.add(simulations.get(simulations.size() - 1));
        } else {
            simulationsReduites = simulations;
        }

        return new SimulationResultDTO(moyenne, intervalleMin, intervalleMax, simulationsReduites);
    }

    //emna
    private static final int ITERATIONS = 1000;  // Nombre de simulations
    private static final int MOIS = 12;          // Nombre de mois (12 mois pour la simulation)

    private FluctuationRateProvider fluctuationRateProvider = new FluctuationRateProvider();

    // Simule les dépenses totales pour chaque catégorie pendant les 12 mois
    public Map<ExpenseCategory, Map<Integer, Double>> simulerDepensesParCategorie(Map<ExpenseCategory, Double> totalMontantParCategorie) {
        Random random = new Random();

        // Map pour stocker les résultats mensuels par catégorie
        Map<ExpenseCategory, Map<Integer, Double>> resultatsParCategorie = new HashMap<>();

        // Effectuer plusieurs simulations (ITERATIONS)
        for (int i = 0; i < ITERATIONS; i++) {
            // Parcourir chaque catégorie
            for (Map.Entry<ExpenseCategory, Double> entry : totalMontantParCategorie.entrySet()) {
                ExpenseCategory categorie = entry.getKey();
                double montantActuel = entry.getValue(); // Montant total actuel des dépenses pour cette catégorie
                double tauxFluctuation = fluctuationRateProvider.getFluctuationRate(categorie.getNom()); // Récupérer le taux de fluctuation pour la catégorie

                // Initialiser la map des résultats pour cette catégorie (si ce n'est pas déjà fait)
                Map<Integer, Double> resultatsMois = resultatsParCategorie.getOrDefault(categorie, new HashMap<>());

                // Appliquer la fluctuation sur le montant total pour chaque mois
                for (int mois = 1; mois <= MOIS; mois++) {
                    // Utiliser une fluctuation aléatoire, basée sur une distribution normale
                    double fluctuation = random.nextGaussian() * tauxFluctuation; // Variation basée sur une loi normale

                    // Si tu préfères une fluctuation uniforme, tu pourrais faire quelque chose comme ça :
                    // double fluctuation = (random.nextDouble() * 2 * tauxFluctuation) - tauxFluctuation;

                    double montantSimule = montantActuel * (1 + fluctuation); // Montant après fluctuation

                    // Ajouter le montant simulé pour le mois courant
                    resultatsMois.put(mois, resultatsMois.getOrDefault(mois, 0.0) + montantSimule);
                }

                // Mettre à jour les résultats de cette catégorie
                resultatsParCategorie.put(categorie, resultatsMois);
            }
        }

        // Calculer la moyenne des résultats sur toutes les simulations pour chaque mois
        Map<ExpenseCategory, Map<Integer, Double>> resultatsMoyenneParCategorie = new HashMap<>();
        for (Map.Entry<ExpenseCategory, Map<Integer, Double>> entry : resultatsParCategorie.entrySet()) {
            ExpenseCategory categorie = entry.getKey();
            Map<Integer, Double> resultatsMois = entry.getValue();

            // Calcul de la moyenne pour chaque mois
            Map<Integer, Double> resultatsMoyenne = new HashMap<>();
            for (Map.Entry<Integer, Double> moisEntry : resultatsMois.entrySet()) {
                int mois = moisEntry.getKey();
                double moyenneMois = moisEntry.getValue() / ITERATIONS;
                resultatsMoyenne.put(mois, moyenneMois);
            }

            resultatsMoyenneParCategorie.put(categorie, resultatsMoyenne);
        }

        return resultatsMoyenneParCategorie;
    }
}
