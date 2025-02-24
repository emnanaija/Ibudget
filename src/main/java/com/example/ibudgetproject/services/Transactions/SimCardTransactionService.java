package com.example.ibudgetproject.services.Transactions;


import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Transactions.SimCardAccountRepository;
import com.example.ibudgetproject.repositories.Transactions.SimCardTransactionRepository;
import com.example.ibudgetproject.repositories.User.UserRepository;
import com.example.ibudgetproject.services.Transactions.Interfaces.ISimCardTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class SimCardTransactionService implements ISimCardTransactionService {

    @Autowired
    private SimCardTransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimCardAccountRepository simCardAccountRepository;

<<<<<<< Updated upstream
=======
    //---------------------Advenced_transactions---------------------------------------
    @Autowired
    private AdvancedTransactionService advancedTransactionService;
    public SimTransactions scheduleTransaction(SimTransactions transaction, LocalDateTime scheduledTime) {
        return advancedTransactionService.scheduleTransaction(transaction, scheduledTime);
    }

    public List<SimTransactions> scheduleRecurringTransaction(SimTransactions transaction, LocalDateTime startTime, int intervalDays, int numberOfRepetitions) {
        return advancedTransactionService.scheduleRecurringTransaction(transaction, startTime, intervalDays, numberOfRepetitions);
    }

    public SimTransactions conditionalTransaction(SimTransactions transaction, double balanceThreshold) {
        return advancedTransactionService.conditionalTransaction(transaction, balanceThreshold);
    }

    public List<SimTransactions> batchTransactions(List<SimTransactions> transactions) {
        return advancedTransactionService.batchTransactions(transactions);
    }
    //-----------------------------------------------------------------------------



    public SimCardAccount getSimCardAccountById(long id){
        return simCardAccountRepository.findById(id).orElse(null);
    }
>>>>>>> Stashed changes
    @Override
    public List<SimTransactions> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public Optional<SimTransactions> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    @Override
    @Transactional
    public SimTransactions createTransaction(SimTransactions transaction) {
        // Validate sender and receiver
        User sender = userRepository.findById(transaction.getSender().getUserId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(transaction.getReceiver().getUserId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Validate sender's SimCardAccount
        SimCardAccount senderAccount = simCardAccountRepository.findById(transaction.getSimCardAccount().getSimCardId())
                .orElseThrow(() -> new RuntimeException("Sender's account not found"));

        // Ensure sender has enough balance
        if (senderAccount.getBalance() < transaction.getAmount()) {
            throw new RuntimeException("Insufficient balance for this transaction.");
        }

        // Deduct from sender and add to receiver
        senderAccount.setBalance(senderAccount.getBalance() - transaction.getAmount());

        // Get or create receiver's SimCardAccount
        SimCardAccount receiverAccount = simCardAccountRepository.findById(receiver.getUserId())
                .orElseThrow(() -> new RuntimeException("Receiver's account not found"));
        receiverAccount.setBalance(receiverAccount.getBalance() + transaction.getAmount());

        // Save updates
        simCardAccountRepository.save(senderAccount);
        simCardAccountRepository.save(receiverAccount);

        // Set relationships and save transaction
        transaction.setSender(sender);
        transaction.setReceiver(receiver);
        transaction.setSimCardAccount(senderAccount);
        return transactionRepository.save(transaction);
    }

    @Override
    @Transactional
    public SimTransactions updateTransaction(Long id, SimTransactions updatedTransaction) {
        return transactionRepository.findById(id).map(transaction -> {
            transaction.setAmount(updatedTransaction.getAmount());
            transaction.setTransactionType(updatedTransaction.getTransactionType());
            transaction.setStatus(updatedTransaction.getStatus());
            transaction.setRefNum(updatedTransaction.getRefNum());
            transaction.setDesc(updatedTransaction.getDesc());
            transaction.setTransactionDate(updatedTransaction.getTransactionDate());

            return transactionRepository.save(transaction);
        }).orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    @Override
    @Transactional
    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }
}
