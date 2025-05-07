package com.example.ibudgetproject.controllers.Transactions;

import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.services.Transactions.SubscriptionService;
import com.example.ibudgetproject.services.Transactions.SimCardTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
            double subscriptionFee = 10.0;
            // Assuming you have a method to create a subscription transaction
            SimTransactions transaction = transactionService.createSubscriptionTransaction(userId, subscriptionFee);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/activate/{userId}")
    public ResponseEntity<Map<String, String>> activatePremiumSubscription(@PathVariable Long userId) {
        try {
            subscriptionService.activatePremiumSubscription(userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Premium subscription activated successfully.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/cancel/{userId}")
    public ResponseEntity<Map<String, String>> cancelPremiumSubscription(@PathVariable Long userId) {
        try {
            subscriptionService.cancelPremiumSubscription(userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Premium subscription canceled successfully.");
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
