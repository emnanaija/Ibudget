package com.example.ibudgetproject.repositories.expenses;

import com.example.ibudgetproject.entities.expenses.Depense;
import com.example.ibudgetproject.entities.expenses.EtatDepense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DepenseRepository extends JpaRepository<Depense, Long> {
    List<Depense> findByWalletId(Long walletId);

    List<Depense> findByWalletIdAndDateBetweenAndEtat(Long walletId, LocalDate startDate, LocalDate endDate, EtatDepense etat);


}
