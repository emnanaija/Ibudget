package com.example.ibudgetproject.services.Transactions.Interfaces;


import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ISimCardTransactionService {
    List<SimTransactions> getAllTransactions();
    Optional<SimTransactions> getTransactionById(Long id);
    List<SimTransactions> getTransactionsByUser(Long userId);
    SimTransactions createTransaction(SimTransactions transaction);
    SimTransactions updateTransaction(Long id, SimTransactions updatedTransaction);
    void deleteTransaction(Long id);
    SimCardAccount getSimCardAccountById(long id);
    SimTransactions scheduleTransaction(SimTransactions transaction, LocalDateTime scheduledTime);
    List<SimTransactions> batchTransactions(List<SimTransactions> transactions);
    SimTransactions conditionalTransaction(SimTransactions transaction, double balanceThreshold);
    List<SimTransactions> scheduleRecurringTransaction(SimTransactions transaction, LocalDateTime startTime, int intervalDays, int numberOfRepetitions);
    SimTransactions createSubscriptionTransaction(Long userId, double subscriptionFee);
}
