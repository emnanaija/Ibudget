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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SimCardTransactionService implements ISimCardTransactionService {
    private static final Logger logger = LoggerFactory.getLogger(SimCardTransactionService.class);

    @Autowired
    private SimCardTransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimCardAccountRepository simCardAccountRepository;

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
        // verif sender and reciver
        User sender = userRepository.findById(transaction.getSender().getUserId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(transaction.getReceiver().getUserId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        //validate sim cardaccount for sender
        SimCardAccount senderAccount = simCardAccountRepository.findById(transaction.getSimCardAccount().getSimCardId())
                .orElseThrow(() -> new RuntimeException("Sender's account not found"));

        //fee log
        double feeAmount = calculateFee(transaction.getAmount());
        transaction.setFeeAmount(feeAmount);

        // enough balanc for transaction+ fee
        if (senderAccount.getBalance() < (transaction.getAmount() + feeAmount)) {
            throw new RuntimeException("Insufficient balance for this transaction and fee.");
        }

        // -balance
        senderAccount.setBalance(senderAccount.getBalance() - (transaction.getAmount() + feeAmount));

        // reciver acc
        SimCardAccount receiverAccount = simCardAccountRepository.findById(receiver.getUserId())
                .orElseThrow(() -> new RuntimeException("Receiver's account not found"));
        receiverAccount.setBalance(receiverAccount.getBalance() + transaction.getAmount());

        // add fee to app
        long systemFeeAccountId = 1L;
        SimCardAccount feeBeneficiaryAccount = simCardAccountRepository.findById(systemFeeAccountId)
                .orElseThrow(() -> new RuntimeException("System fee beneficiary account not found"));


        feeBeneficiaryAccount.setBalance(feeBeneficiaryAccount.getBalance() + feeAmount);

        logger.info("Fee of {} collected and added to system fee account (ID: {}).", feeAmount, systemFeeAccountId);

        // sv
        simCardAccountRepository.save(senderAccount);
        simCardAccountRepository.save(receiverAccount);
        simCardAccountRepository.save(feeBeneficiaryAccount);

        transaction.setSender(sender);
        transaction.setReceiver(receiver);
        transaction.setSimCardAccount(senderAccount);
        return transactionRepository.save(transaction);
    }

    private double calculateFee(double transactionAmount) {
        return Math.max(1.0, transactionAmount * 0.01);
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
