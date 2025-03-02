package com.example.ibudgetproject.controllers.expenses;

import com.example.ibudgetproject.entities.expenses.DepenseReccurente;
import com.example.ibudgetproject.entities.expenses.ExpenseCategory;
import com.example.ibudgetproject.services.MonteCarloService;
import com.example.ibudgetproject.services.expenses.DepenseReccurenteService;
import com.example.ibudgetproject.services.expenses.ExpenseCategoryService;
import com.example.ibudgetproject.services.expenses.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/depenses-recurrentes")
@RequiredArgsConstructor
public class DepenseRecurrenteController {

    private final DepenseReccurenteService depenseRecurrenteService;
    @Autowired
    private MonteCarloService monteCarloService;

    @Autowired
    private GeminiService geminiService;

    @PostMapping
    public ResponseEntity<DepenseReccurente> ajouterDepense(@RequestBody DepenseReccurente depense) {
        return ResponseEntity.ok(depenseRecurrenteService.ajouterDepense(depense));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepenseReccurente> modifierDepense(@PathVariable Long id, @RequestBody DepenseReccurente depense) {
        return ResponseEntity.ok(depenseRecurrenteService.modifierDepense(id, depense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> supprimerDepense(@PathVariable Long id) {
        depenseRecurrenteService.supprimerDepense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<DepenseReccurente>> listerDepenses() {
        return ResponseEntity.ok(depenseRecurrenteService.listerDepenses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepenseReccurente> getDepense(@PathVariable Long id) {
        return ResponseEntity.ok(depenseRecurrenteService.getDepenseById(id));
    }


    @PostMapping("/traiter")
    public ResponseEntity<String> traiterDepensesRecurrentes() {
        depenseRecurrenteService.traiterDepensesRecurrentes();
        return ResponseEntity.ok("Traitement des dépenses récurrentes effectué.");
    }
    @GetMapping("/total-depenses-categories")
    public Map<ExpenseCategory, Double> getTotalDepensesParCategorie() {
        return depenseRecurrenteService.calculerTotalMontantParCategorie();
    }



    @GetMapping("/simuler-depenses-categorie")
    public Map<ExpenseCategory, Map<Integer, Double>> simulerDepensesParCategorie() {
        // Récupérer les dépenses totales par catégorie
        Map<ExpenseCategory, Double> totalMontantParCategorie = depenseRecurrenteService.calculerTotalMontantParCategorie();

        // Simuler les dépenses pour chaque catégorie sur les 12 mois
        return monteCarloService.simulerDepensesParCategorie(totalMontantParCategorie);
    }


    @GetMapping("/simulation-et-recommandations")
    public ResponseEntity<String> simulerEtObtenirRecommandations() {
        // 1️⃣ Récupérer les dépenses totales par catégorie
        Map<ExpenseCategory, Double> totalMontantParCategorie = depenseRecurrenteService.calculerTotalMontantParCategorie();

        // 2️⃣ Exécuter la simulation de Monte Carlo
        Map<ExpenseCategory, Map<Integer, Double>> resultatsSimulation = monteCarloService.simulerDepensesParCategorie(totalMontantParCategorie);

        // 3️⃣ Construire un prompt détaillé pour chaque catégorie
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

            // 4️⃣ Ajouter une analyse pour chaque catégorie
            prompt.append("\nAnalyse demandée :\n");
            prompt.append("1️⃣ Quelles pourraient être les raisons de ces fluctuations pour la catégorie '")
                    .append(categorie.getNom()).append("' ?\n");
            prompt.append("2️⃣ Quels conseils financiers pourrais-tu me donner pour mieux gérer cette catégorie et optimiser mon budget ?\n\n");
        }

        // 5️⃣ Envoyer le prompt à Gemini
        String recommendations = geminiService.getSuggestions(prompt.toString());

        // 6️⃣ Retourner les recommandations
        return ResponseEntity.ok(recommendations);
    }

}
