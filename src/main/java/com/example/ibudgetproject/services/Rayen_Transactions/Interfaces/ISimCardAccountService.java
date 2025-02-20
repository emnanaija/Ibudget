package com.example.ibudgetproject.services.Rayen_Transactions.Interfaces;


import com.example.ibudgetproject.entities.Rayen_Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Rayen_Transactions.SimCardTransactions;

import java.util.List;
import java.util.Optional;

public interface ISimCardAccountService {

    List<SimCardAccount> getAllSimCardAccounts();

    Optional<SimCardAccount> getSimCardAccountById(Long id);

    SimCardAccount createSimCardAccount(SimCardAccount simCardAccount);

    void updateSimCardAccount(Long id, SimCardAccount updatedSimCardAccount);

    void deleteSimCardAccount(Long id);

    // Transactions handling

    List<SimCardTransactions> getTransactionsByUser(Long userId);

    // Monte Carlo Predictions
    double[] predictTransactionVolumes(Long simCardId, int numFutureMonths);

    double optimizeBudget(Long simCardId, double totalBudget);
}
