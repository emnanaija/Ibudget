package com.example.ibudgetproject.services.Transactions;

import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Transactions.SimCardTransactionRepository;
import com.example.ibudgetproject.repositories.User.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdvancedTransactionService {

    @Autowired
    private SimCardTransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    public SimTransactions scheduleTransaction(SimTransactions transaction, LocalDateTime scheduledTime) {
        transaction.setTransactionDate(scheduledTime);
        return transactionRepository.save(transaction);
    }

    public List<SimTransactions> scheduleRecurringTransaction(SimTransactions transaction, LocalDateTime startTime, int intervalDays, int numberOfRepetitions) {
        List<SimTransactions> scheduledTransactions = java.util.stream.IntStream.range(0, numberOfRepetitions)
                .mapToObj(i -> {
                    LocalDateTime scheduledTime = startTime.plusDays(i * intervalDays);
                    SimTransactions recurringTransaction = new SimTransactions();
                    recurringTransaction.setAmount(transaction.getAmount());
                    recurringTransaction.setTransactionType(transaction.getTransactionType());
                    recurringTransaction.setStatus(transaction.getStatus());
                    recurringTransaction.setRefNum(transaction.getRefNum());
                    recurringTransaction.setDesc(transaction.getDesc());
                    recurringTransaction.setTransactionDate(scheduledTime);
                    recurringTransaction.setSimCardAccount(transaction.getSimCardAccount());

                    User sender = userRepository.findById(transaction.getSender().getUserId()).orElse(null);
                    User receiver = userRepository.findById(transaction.getReceiver().getUserId()).orElse(null);

                    recurringTransaction.setSender(sender);
                    recurringTransaction.setReceiver(receiver);

                    return transactionRepository.save(recurringTransaction);
                })
                .collect(Collectors.toList());
        return scheduledTransactions;
    }

    public SimTransactions conditionalTransaction(SimTransactions transaction, double balanceThreshold) {
        if (transaction.getSimCardAccount().getBalance() >= balanceThreshold) {
            return transactionRepository.save(transaction);
        } else {
            throw new RuntimeException("Balance below threshold, transaction not executed.");
        }
    }

    public List<SimTransactions> batchTransactions(List<SimTransactions> transactions) {
        return transactionRepository.saveAll(transactions);
    }
}