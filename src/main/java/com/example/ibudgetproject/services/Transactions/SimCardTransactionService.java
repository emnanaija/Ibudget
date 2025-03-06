package com.example.ibudgetproject.services.Transactions;


import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.Transactions.TransactionType;
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
import java.util.ArrayList;
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
    private static final long SYSTEM_SIM_CARD_ID = 1L; // System account ID

    //---------------------Advanced Transactions---------------------------------------

    @Override
    @Transactional
    public SimTransactions scheduleTransaction(SimTransactions transaction, LocalDateTime scheduledTime) {
        double feeAmount = calculateFee(transaction.getAmount());
        transaction.setFeeAmount(feeAmount);
        return createTransaction(transaction);
    }

    @Override
    @Transactional
    public List<SimTransactions> scheduleRecurringTransaction(SimTransactions transaction, LocalDateTime startTime, int intervalDays, int numberOfRepetitions) {
        List<SimTransactions> transactions = new ArrayList<>();

        for (int i = 0; i < numberOfRepetitions; i++) {
            double feeAmount = calculateFee(transaction.getAmount());
            transaction.setFeeAmount(feeAmount);
            SimTransactions scheduledTransaction = createTransaction(transaction);
            transactions.add(scheduledTransaction);
            transaction.setTransactionDate(startTime.plusDays(intervalDays * (i + 1)));
        }

        return transactions;
    }

    @Override
    @Transactional
    public SimTransactions conditionalTransaction(SimTransactions transaction, double balanceThreshold) {

        double feeAmount = calculateFee(transaction.getAmount());
        SimCardAccount senderAccount = transaction.getSimCardAccount();

        if (senderAccount.getBalance() < (transaction.getAmount() + feeAmount)) {
            throw new RuntimeException("Insufficient balance for this transaction and fee.");
        }
        senderAccount.setBalance(senderAccount.getBalance() - feeAmount);

        SimCardAccount systemAccount = simCardAccountRepository.findById(SYSTEM_SIM_CARD_ID)
                .orElseThrow(() -> new RuntimeException("System fee beneficiary account not found"));
        systemAccount.setBalance(systemAccount.getBalance() + feeAmount);

        // Save updates
        simCardAccountRepository.save(senderAccount);
        simCardAccountRepository.save(systemAccount);

        // Perform the conditional transaction
        if (senderAccount.getBalance() >= balanceThreshold) {
            return createTransaction(transaction);
        } else {
            throw new RuntimeException("Sender's balance is below the threshold.");
        }
    }

    @Override
    @Transactional
    public List<SimTransactions> batchTransactions(List<SimTransactions> transactions) {
        List<SimTransactions> processedTransactions = new ArrayList<>();

        for (SimTransactions transaction : transactions) {
            double feeAmount = calculateFee(transaction.getAmount());
            transaction.setFeeAmount(feeAmount);
            SimTransactions processedTransaction = createTransaction(transaction);
            processedTransactions.add(processedTransaction);
        }

        return processedTransactions;
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

    @Override
    @Transactional
    public SimTransactions createSubscriptionTransaction(Long userId, double subscriptionFee) {
        // Validate the user (sender)
        User sender = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // Validate the sender's SimCardAccount
        SimCardAccount senderAccount = simCardAccountRepository.findById(sender.getSimCardAccount().getSimCardId())
                .orElseThrow(() -> new RuntimeException("Sender's account not found"));

        // Ensure the user has enough balance for the subscription fee
        if (senderAccount.getBalance() < subscriptionFee) {
            throw new RuntimeException("Insufficient balance for the subscription fee.");
        }

        // Deduct the subscription fee from the sender's account
        senderAccount.setBalance(senderAccount.getBalance() - subscriptionFee);

        // Validate the system user (receiver with id = 2)
        User systemUser = userRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("System user (receiver) not found"));

        // Retrieve the SimCardAccount for the system user (id = 2)
        SimCardAccount systemAccount = (SimCardAccount) simCardAccountRepository.findByUser(systemUser)
                .orElseThrow(() -> new RuntimeException("System fee beneficiary account not found"));

        // Ensure the system account belongs to the system user (id = 2)
        if (!systemAccount.getUser().getUserId().equals(2L)) {
            throw new RuntimeException("System account does not belong to the system user (id = 2)");
        }

        // Add the subscription fee to the system account
        systemAccount.setBalance(systemAccount.getBalance() + subscriptionFee);

        // Save updates
        simCardAccountRepository.save(senderAccount);
        simCardAccountRepository.save(systemAccount);

        // Create and save the subscription transaction
        SimTransactions subscriptionTransaction = new SimTransactions();
        subscriptionTransaction.setAmount(subscriptionFee);
        subscriptionTransaction.setTransactionType(TransactionType.SUBSCRIPTION);
        subscriptionTransaction.setStatus("COMPLETED");
        subscriptionTransaction.setTransactionDate(LocalDateTime.now());
        subscriptionTransaction.setSender(sender);
        subscriptionTransaction.setReceiver(systemUser); // Set receiver as the system user (id = 2)
        subscriptionTransaction.setSimCardAccount(senderAccount);

        return transactionRepository.save(subscriptionTransaction);
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
