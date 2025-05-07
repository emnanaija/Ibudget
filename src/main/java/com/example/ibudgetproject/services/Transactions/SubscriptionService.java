package com.example.ibudgetproject.services.Transactions;

import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.Transactions.TransactionType;
import com.example.ibudgetproject.entities.User.TypeAccount;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Transactions.SimCardAccountRepository;
import com.example.ibudgetproject.repositories.User.UserRepository;
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
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getAccountType() == TypeAccount.Premium) {
            throw new RuntimeException("User is already on Premium");
        }
        SimCardAccount senderAccount = user.getSimCardAccount();
        if (senderAccount == null) {
            throw new RuntimeException("User does not have a SimCardAccount");
        }
        SimTransactions transaction = new SimTransactions();
        transaction.setAmount(PREMIUM_SUBSCRIPTION_FEE);
        transaction.setTransactionType(TransactionType.SUBSCRIPTION);
        transaction.setStatus("COMPLETED");
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setSender(user);
        transaction.setReceiver(userRepository.findById(1L).orElseThrow(() -> new RuntimeException("System user not found")));
        transaction.setSimCardAccount(senderAccount);
        transactionService.createSubscriptionTransaction(userId, PREMIUM_SUBSCRIPTION_FEE);
        user.setAccountType(TypeAccount.Premium);
        userRepository.save(user);
    }
    public void cancelPremiumSubscription(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getAccountType() != TypeAccount.Premium) {
            throw new RuntimeException("User is not on Premium");
        }
        user.setAccountType(TypeAccount.Fremium);
        userRepository.save(user);
    }
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