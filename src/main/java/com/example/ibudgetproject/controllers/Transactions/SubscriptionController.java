package com.example.ibudgetproject.controllers.Transactions;

import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.services.Transactions.SimCardTransactionService;
import com.example.ibudgetproject.services.Transactions.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/subscription")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;



        @Autowired
        private SimCardTransactionService transactionService;

        @PostMapping("/pay/{userId}")
        public ResponseEntity<?> paySubscription(@PathVariable Long userId) {
            try {
                double subscriptionFee =10.0             ;
                SimTransactions transaction = transactionService.createSubscriptionTransaction(userId, subscriptionFee);
                return ResponseEntity.ok(transaction);
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
        }

    @PostMapping("/activate/{userId}")
    public ResponseEntity<String> activatePremiumSubscription(@PathVariable Long userId) {
        try {
            subscriptionService.activatePremiumSubscription(userId);
            return ResponseEntity.ok("Premium subscription activated successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/cancel/{userId}")
    public ResponseEntity<String> cancelPremiumSubscription(@PathVariable Long userId) {
        try {
            subscriptionService.cancelPremiumSubscription(userId);
            return ResponseEntity.ok("Premium subscription canceled successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}