package com.example.ibudgetproject.controllers.expenses;

import com.example.ibudgetproject.entities.expenses.DepenseReccurente;
import com.example.ibudgetproject.entities.expenses.ExpenseCategory;
import com.example.ibudgetproject.services.MonteCarloService;
import com.example.ibudgetproject.services.expenses.DepenseReccurenteService;
import com.example.ibudgetproject.services.expenses.ExpenseCategoryService;
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

    @Autowired
    private MonteCarloService monteCarloService;

    @GetMapping("/simuler-depenses-categorie")
    public Map<ExpenseCategory, Map<Integer, Double>> simulerDepensesParCategorie() {
        // Récupérer les dépenses totales par catégorie
        Map<ExpenseCategory, Double> totalMontantParCategorie = depenseRecurrenteService.calculerTotalMontantParCategorie();

        // Simuler les dépenses pour chaque catégorie sur les 12 mois
        return monteCarloService.simulerDepensesParCategorie(totalMontantParCategorie);
    }
}
