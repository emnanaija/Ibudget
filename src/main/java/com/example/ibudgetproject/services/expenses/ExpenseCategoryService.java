package com.example.ibudgetproject.services.expenses;

import com.example.ibudgetproject.entities.expenses.Depense;
import com.example.ibudgetproject.entities.expenses.ExpenseCategory;
import com.example.ibudgetproject.repositories.expenses.DepenseRepository;
import com.example.ibudgetproject.repositories.expenses.ExpenseCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ExpenseCategoryService {

    @Autowired
    private ExpenseCategoryRepository categoryRepository;
    @Autowired
    private DepenseRepository depenseRepository;
    // ✅ Ajouter une catégorie (montantDepensé est toujours 0.0)
    public ExpenseCategory addCategory(ExpenseCategory category) {
        if (category.getNom() == null || category.getNom().isEmpty()) {
            throw new RuntimeException("Le nom de la catégorie ne peut pas être vide !");
        }
        if (categoryRepository.existsByNom(category.getNom())) {
            throw new RuntimeException("Une catégorie avec ce nom existe déjà !");
        }
        category.setMontantDepense(0.0); // Assurer que ce champ est toujours 0
        return categoryRepository.save(category);
    }


    // ✅ Modifier une catégorie (⚠️ montantDepensé NE DOIT PAS être modifié)
    public ExpenseCategory updateCategory(Long id, ExpenseCategory categoryDetails) {
        Optional<ExpenseCategory> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            ExpenseCategory category = existingCategory.get();
            category.setNom(categoryDetails.getNom());
            category.setDescription(categoryDetails.getDescription());
            category.setBudgetAlloue(categoryDetails.getBudgetAlloue());
            // ❌ Ne pas modifier montantDepensé ici
            return categoryRepository.save(category);
        } else {
            throw new RuntimeException("Catégorie non trouvée !");
        }
    }

    // ✅ Supprimer une catégorie
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Catégorie non trouvée !");
        }
        categoryRepository.deleteById(id);
    }

    // ✅ Récupérer toutes les catégories
    public List<ExpenseCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    // ✅ Récupérer une catégorie par ID
    public ExpenseCategory getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Catégorie non trouvée !"));
    }



    public List<Map<String, Object>> getSoldeRestantParCategorie() {
        List<ExpenseCategory> categories = categoryRepository.findAll();
        List<Map<String, Object>> resultat = new ArrayList<>();

        for (ExpenseCategory categorie : categories) {
            Map<String, Object> categorieData = new HashMap<>();
            categorieData.put("id", categorie.getId());
            categorieData.put("nom", categorie.getNom());
            categorieData.put("budget_alloué", categorie.getBudgetAlloue());
            categorieData.put("montant_dépensé", categorie.getMontantDepense());
            categorieData.put("solde_restant", categorie.getSoldeRestant()); // Calcul automatique

            resultat.add(categorieData);
        }
        return resultat;
    }
    public List<Map<String, Object>> getAlertesDepenses() {
        List<ExpenseCategory> categories = categoryRepository.findAll();
        List<Map<String, Object>> alertes = new ArrayList<>();

        for (ExpenseCategory categorie : categories) {
            double budgetAlloue = categorie.getBudgetAlloue();
            double montantDepense = categorie.getMontantDepense();

            // Vérifier si 70% du budget est dépassé
            if (montantDepense >= 0.7 * budgetAlloue) {
                Map<String, Object> alerteData = new HashMap<>();
                alerteData.put("id", categorie.getId());
                alerteData.put("nom", categorie.getNom());
                alerteData.put("budget_alloué", budgetAlloue);
                alerteData.put("montant_dépensé", montantDepense);
                alerteData.put("message", "Attention : Vous avez atteint 70% du budget alloué pour cette catégorie !");

                alertes.add(alerteData);
            }
        }
        return alertes;
    }
    public List<Map<String, Object>> getCategoriesWithWallets() {
        List<ExpenseCategory> categories = categoryRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (ExpenseCategory category : categories) {
            Map<String, Object> categoryData = new HashMap<>();
            categoryData.put("id", category.getId());
            categoryData.put("nom", category.getNom());

            // Récupérer les dépenses associées à cette catégorie
            List<Depense> depenses = depenseRepository.findByCategory(category);

            // Ajouter les wallets associés
            List<Long> walletIds = new ArrayList<>();
            for (Depense depense : depenses) {
                walletIds.add(depense.getWallet().getId());  // Récupérer l'ID du wallet de chaque dépense
            }

            categoryData.put("wallets", walletIds);  // Ajouter les IDs de wallet associés à la catégorie
            result.add(categoryData);
        }

        return result;
    }

}
