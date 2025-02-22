package com.example.ibudgetproject.services.Transactions.Interfaces;


import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ISimCardAccountService {

    List<SimCardAccount> getAllSimCardAccounts();

    Optional<SimCardAccount> getSimCardAccountById(Long id);

    SimCardAccount createSimCardAccount(SimCardAccount simCardAccount);

    void updateSimCardAccount(Long id, SimCardAccount updatedSimCardAccount);

    void deleteSimCardAccount(Long id);

    // Transactions handling

    List<SimTransactions> getTransactionsByUser(Long userId);

    // Monte Carlo Predictions
    Map<String, Object> predictTransactionVolumes(Long simCardId, int numFutureMonths);

    double optimizeBudget(Long simCardId, double totalBudget);
}
