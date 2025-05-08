package com.example.ibudgetproject.controllers.expenses;

import com.example.ibudgetproject.entities.expenses.DepenseReccurente;
import com.example.ibudgetproject.entities.expenses.ExpenseCategory;
import com.example.ibudgetproject.services.MonteCarloService;
import com.example.ibudgetproject.services.expenses.DepenseReccurenteService;
import com.example.ibudgetproject.services.expenses.ExpenseCategoryService;
import com.example.ibudgetproject.services.expenses.GeminiService;
import com.example.ibudgetproject.services.expenses.SimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/depenses-recurrentes")
@RequiredArgsConstructor
@CrossOrigin(origins="http://localhost:4200")  // Assure-toi d'utiliser une origine valide
public class DepenseRecurrenteController {

    private final DepenseReccurenteService depenseRecurrenteService;
    @Autowired
    private MonteCarloService monteCarloService;

    @Autowired
    private GeminiService geminiService;
    @Autowired
    private SimulationService simulationService;

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
        // Appeler la méthode du service SimulationService
        String recommendations = simulationService.simulerEtObtenirRecommandations();

        // Retourner les recommandations dans la réponse HTTP
        return ResponseEntity.ok(recommendations);
    }
    @GetMapping("/totales-par-categorie")
    public ResponseEntity<List<Map<String, Object>>> getDepenseTotalesParCategorie() {
        List<Map<String, Object>> result = depenseRecurrenteService.getDepenseTotalesParCategorie();
        return ResponseEntity.ok(result);
    }
    // 🔁 Endpoint pour obtenir les prochaines dates d'exécution
    @GetMapping("/prochaines-executions")
    public Map<Long, LocalDate> getProchainesExecutions() {
        return depenseRecurrenteService.getProchainesDatesExecution();
    }
}
