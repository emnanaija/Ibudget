package com.example.ibudgetproject.repositories.expenses;

import com.example.ibudgetproject.entities.expenses.SpendingWallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpendingWalletRepository extends JpaRepository<SpendingWallet, Long> {

}
