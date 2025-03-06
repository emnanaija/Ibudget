package com.example.ibudgetproject.services.Transactions;

import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.Transactions.TransactionType;
import com.example.ibudgetproject.entities.User.TypeAccount;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Transactions.SimCardAccountRepository;
import com.example.ibudgetproject.repositories.User.UserRepository;
import com.example.ibudgetproject.services.Transactions.SimCardTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriptionService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimCardTransactionService transactionService;
    @Autowired
    private SimCardAccountRepository simCardAccountRepository;

    private static final double PREMIUM_SUBSCRIPTION_FEE = 10.0; 
    private static final long SYSTEM_SIM_CARD_ID = 1L;

    public void activatePremiumSubscription(Long userId) {
        // Validate the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the user is already on Premium
        if (user.getAccountType() == TypeAccount.Premium) {
            throw new RuntimeException("User is already on Premium");
        }

        // Validate the user's SimCardAccount
        SimCardAccount senderAccount = user.getSimCardAccount();
        if (senderAccount == null) {
            throw new RuntimeException("User does not have a SimCardAccount");
        }

        // Create and save the subscription transaction
        SimTransactions transaction = new SimTransactions();
        transaction.setAmount(PREMIUM_SUBSCRIPTION_FEE);
        transaction.setTransactionType(TransactionType.SUBSCRIPTION);
        transaction.setStatus("COMPLETED");
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setSender(user);
        transaction.setReceiver(userRepository.findById(2L) // Set receiver as the system user (id = 2)
                .orElseThrow(() -> new RuntimeException("System user not found")));
        transaction.setSimCardAccount(senderAccount);

        // Let createSubscriptionTransaction handle the fee deduction
        transactionService.createSubscriptionTransaction(userId, PREMIUM_SUBSCRIPTION_FEE);

        // Update the user's account type to Premium
        user.setAccountType(TypeAccount.Premium);
        userRepository.save(user);
    }

    /**
     * Cancel Premium Subscription for a user.
     */
    public void cancelPremiumSubscription(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if the user is on Premium
        if (user.getAccountType() != TypeAccount.Premium) {
            throw new RuntimeException("User is not on Premium");
        }

        // Downgrade the user to Fremium
        user.setAccountType(TypeAccount.Fremium);
        userRepository.save(user);
    }

    /**
     * Scheduled task to process monthly subscription fees.
     */
    @Scheduled(cron = "0 0 0 1 * *")
    public void processMonthlySubscriptions() {
        List<User> premiumUsers = userRepository.findByAccountType(TypeAccount.Premium);

        for (User user : premiumUsers) {
            try {
                transactionService.createSubscriptionTransaction(user.getUserId(), PREMIUM_SUBSCRIPTION_FEE);
            } catch (Exception e) {
                System.err.println("Failed to process subscription for user " + user.getUserId() + ": " + e.getMessage());
                user.setAccountType(TypeAccount.Fremium);
                userRepository.save(user);
            }
        }
    }

}