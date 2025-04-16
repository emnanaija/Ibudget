package com.example.ibudgetproject.controllers.expenses;


import com.example.ibudgetproject.entities.expenses.ExpenseCategory;
import com.example.ibudgetproject.services.expenses.ExpenseCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")  // Front-end Angular

@RequestMapping("/api/categories")
public class ExpenseCategoryController {

    @Autowired
    private ExpenseCategoryService categoryService;

    // ✅ Ajouter une catégorie
    @PostMapping
    public ExpenseCategory createCategory(@RequestBody ExpenseCategory category) {
        return categoryService.addCategory(category);
    }

    // ✅ Modifier une catégorie (sauf montantDepensé)
    @PutMapping("/{id}")
    public ExpenseCategory updateCategory(@PathVariable Long id, @RequestBody ExpenseCategory category) {
        return categoryService.updateCategory(id, category);
    }

    // ✅ Supprimer une catégorie
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
    }

    // ✅ Lister toutes les catégories
    @GetMapping
    public List<ExpenseCategory> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // ✅ Obtenir une catégorie par ID
    @GetMapping("/{id}")
    public ExpenseCategory getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }



    @GetMapping("/solde-restant")
    public ResponseEntity<List<Map<String, Object>>> getSoldeRestant() {
        List<Map<String, Object>> result = categoryService.getSoldeRestantParCategorie();
        return ResponseEntity.ok(result);
    }
    @GetMapping("/alertes-depenses")
    public List<Map<String, Object>> getAlertesDepenses() {
        return categoryService.getAlertesDepenses();
    }

}
