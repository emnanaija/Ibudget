package com.example.ibudgetproject.services.Rayen_Transactions.Interfaces;


import com.example.ibudgetproject.entities.Rayen_Transactions.SimCardTransactions;

import java.util.List;
import java.util.Optional;

public interface ISimCardTransactionService {
    List<SimCardTransactions> getAllTransactions();
    Optional<SimCardTransactions> getTransactionById(Long id);
    SimCardTransactions createTransaction(SimCardTransactions transaction);
    SimCardTransactions updateTransaction(Long id, SimCardTransactions updatedTransaction);
    void deleteTransaction(Long id);
}
