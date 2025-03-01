package com.example.ibudgetproject.repositories.expenses;


import com.example.ibudgetproject.entities.expenses.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Long> {
    boolean existsByNom(String nom); // Pour éviter les doublons
    Optional<ExpenseCategory> findByNom(String nom);

}
