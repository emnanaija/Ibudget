package com.example.ibudgetproject.services.expenses;

import com.example.ibudgetproject.entities.expenses.ExpenseCategory;
import com.example.ibudgetproject.services.MonteCarloService;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class SimulationService {

    private final DepenseReccurenteService depenseRecurrenteService;
    private final MonteCarloService monteCarloService;
    private final GeminiService geminiService;

    public SimulationService(DepenseReccurenteService depenseRecurrenteService,
                             MonteCarloService monteCarloService,
                             GeminiService geminiService) {
        this.depenseRecurrenteService = depenseRecurrenteService;
        this.monteCarloService = monteCarloService;
        this.geminiService = geminiService;
    }

    public String simulerEtObtenirRecommandations() {
        Map<ExpenseCategory, Double> totalMontantParCategorie = depenseRecurrenteService.calculerTotalMontantParCategorie();
        Map<ExpenseCategory, Map<Integer, Double>> resultatsSimulation = monteCarloService.simulerDepensesParCategorie(totalMontantParCategorie);

        StringBuilder prompt = new StringBuilder();
        prompt.append("J'ai effectué une simulation de mes dépenses récurrentes par catégorie pour les 12 prochains mois. Voici les résultats :\n\n");

        for (Map.Entry<ExpenseCategory, Map<Integer, Double>> entry : resultatsSimulation.entrySet()) {
            ExpenseCategory categorie = entry.getKey();
            Map<Integer, Double> resultatsMois = entry.getValue();

            prompt.append("Catégorie : ").append(categorie.getNom()).append("\n");
            prompt.append("Dépenses mensuelles simulées :\n");

            for (Map.Entry<Integer, Double> moisEntry : resultatsMois.entrySet()) {
                int mois = moisEntry.getKey();
                double montant = moisEntry.getValue();
                prompt.append("  Mois ").append(mois).append(": ").append(String.format("%.2f", montant)).append(" TND\n");
            }

            prompt.append("\nAnalyse demandée :\n");
            prompt.append("1️⃣ Quelles pourraient être les raisons de ces fluctuations pour la catégorie ")
                    .append(categorie.getNom()).append(" ?\n");
            prompt.append("2️⃣ Quels conseils financiers pourrais-tu me donner pour mieux gérer cette catégorie et optimiser mon budget ?\n\n");
        }

        return geminiService.getSuggestions(prompt.toString());
    }
}
