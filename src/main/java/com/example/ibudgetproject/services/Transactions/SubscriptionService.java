package com.example.ibudgetproject.services.Transactions;

import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.Transactions.TransactionType;
import com.example.ibudgetproject.entities.User.Role;
import com.example.ibudgetproject.entities.User.TypeAccount;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Transactions.SimCardAccountRepository;
import com.example.ibudgetproject.repositories.User.RoleRepository;
import com.example.ibudgetproject.repositories.User.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubscriptionService {

    private static final double PREMIUM_SUBSCRIPTION_FEE = 10.0;
    private static final long SYSTEM_SIM_CARD_ID = 1L;
    private static final long ROLE_FREMIUM_ID = 5L;
    private static final long ROLE_PREMIUM_ID = 6L;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private SimCardTransactionService transactionService;

    @Autowired
    private SimCardAccountRepository simCardAccountRepository;

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

        // Perform transaction
        transactionService.createSubscriptionTransaction(userId, PREMIUM_SUBSCRIPTION_FEE);

        // Change account type and role
        user.setAccountType(TypeAccount.Premium);
        Role premiumRole = roleRepository.findById(ROLE_PREMIUM_ID)
                .orElseThrow(() -> new RuntimeException("Premium role not found"));
        user.setRole(premiumRole);

        userRepository.save(user);
    }

    public void cancelPremiumSubscription(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getAccountType() != TypeAccount.Premium) {
            throw new RuntimeException("User is not on Premium");
        }

        user.setAccountType(TypeAccount.Fremium);
        Role fremiumRole = roleRepository.findById(ROLE_FREMIUM_ID)
                .orElseThrow(() -> new RuntimeException("Fremium role not found"));
        user.setRole(fremiumRole);

        userRepository.save(user);
    }

    @Scheduled(cron = "0 0 0 1 * *") // Every 1st of the month at midnight
    public void processMonthlySubscriptions() {
        List<User> premiumUsers = userRepository.findByAccountType(TypeAccount.Premium);

        for (User user : premiumUsers) {
            try {
                transactionService.createSubscriptionTransaction(user.getUserId(), PREMIUM_SUBSCRIPTION_FEE);
            } catch (Exception e) {
                System.err.println("Failed to process subscription for user " + user.getUserId() + ": " + e.getMessage());
                user.setAccountType(TypeAccount.Fremium);

                Role fremiumRole = roleRepository.findById(ROLE_FREMIUM_ID)
                        .orElseThrow(() -> new RuntimeException("Fremium role not found"));
                user.setRole(fremiumRole);

                userRepository.save(user);
            }
        }
    }
}
