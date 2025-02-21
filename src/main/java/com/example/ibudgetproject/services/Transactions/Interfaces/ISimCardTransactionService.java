package com.example.ibudgetproject.services.Transactions.Interfaces;


import com.example.ibudgetproject.entities.Transactions.SimTransactions;

import java.util.List;
import java.util.Optional;

public interface ISimCardTransactionService {
    List<SimTransactions> getAllTransactions();
    Optional<SimTransactions> getTransactionById(Long id);
    SimTransactions createTransaction(SimTransactions transaction);
    SimTransactions updateTransaction(Long id, SimTransactions updatedTransaction);
    void deleteTransaction(Long id);
}
