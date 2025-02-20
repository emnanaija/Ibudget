package com.example.ibudgetproject.services.Rayen_Transactions;


import com.example.ibudgetproject.entities.Rayen_Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Rayen_Transactions.SimCardTransactions;
import com.example.ibudgetproject.entities.Rihab_User.User;
import com.example.ibudgetproject.repositories.Rayen_Transactions.SimCardAccountRepository;
import com.example.ibudgetproject.repositories.Rayen_Transactions.SimCardTransactionRepository;
import com.example.ibudgetproject.repositories.Rihab_User.UserRepository;
import com.example.ibudgetproject.services.Rayen_Transactions.Interfaces.ISimCardTransactionService;
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

    @Override
    public List<SimCardTransactions> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Override
    public Optional<SimCardTransactions> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }

    @Override
    @Transactional
    public SimCardTransactions createTransaction(SimCardTransactions transaction) {
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
    public SimCardTransactions updateTransaction(Long id, SimCardTransactions updatedTransaction) {
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
