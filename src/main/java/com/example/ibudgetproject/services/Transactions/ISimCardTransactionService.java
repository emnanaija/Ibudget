package com.example.ibudgetproject.services.Transactions;

import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.User.User;

import java.util.List;

public interface ISimCardTransactionService {
    List<SimTransactions> getAllTransactions();
    SimTransactions getTransactionById(Long id);
    SimTransactions createTransaction(SimTransactions transaction);
    List<SimTransactions> batchTransactions(List<SimTransactions> transactions);
    List<SimTransactions> getTransactionsByUser(Long userId);
} 