package com.example.ibudgetproject.controllers.Transactions;


import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.services.Transactions.Interfaces.ISimCardTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transaction")
public class SimCardTransactionController {
    @Autowired
    private ISimCardTransactionService transactionService;
    @GetMapping
    public List<SimTransactions> getAllTransactions() {
        return transactionService.getAllTransactions();
    }
    @GetMapping("/{id}")
    public ResponseEntity<SimTransactions> getTransactionById(@PathVariable Long id) {
        Optional<SimTransactions> transaction = transactionService.getTransactionById(id);
        return transaction.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/user/{userId}")
    public List<SimTransactions> getTransactionsByUserId(@PathVariable Long userId) {
        return transactionService.getTransactionsByUser(userId);
    }
    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody SimTransactions transaction) {
        if (transaction.getReceiver() == null || transaction.getSender() == null) {
            return ResponseEntity.badRequest().body("U need a sender and a reciver ! ");
        }
        SimTransactions createdTransaction = transactionService.createTransaction(transaction);
        return ResponseEntity.ok(createdTransaction);
    }
    @PutMapping("/{id}")
    public ResponseEntity<SimTransactions> updateTransaction(
            @PathVariable Long id, @RequestBody SimTransactions updatedTransaction) {
        try {
            SimTransactions transaction = transactionService.updateTransaction(id, updatedTransaction);
            return ResponseEntity.ok(transaction);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }



    //----------------------------advanced_transactions---------------------------------------
    @PostMapping("/schedule")
    public ResponseEntity<SimTransactions> scheduleTransaction(
            @RequestBody SimTransactions transaction,
            @RequestParam("scheduledTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime scheduledTime) {
        SimTransactions scheduled = transactionService.scheduleTransaction(transaction, scheduledTime);
        return ResponseEntity.ok(scheduled);
    }

    @PostMapping("/recurring")
    public ResponseEntity<List<SimTransactions>> scheduleRecurringTransaction(
            @RequestBody SimTransactions transaction,
            @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam("intervalDays") int intervalDays,
            @RequestParam("numberOfRepetitions") int numberOfRepetitions) {
        List<SimTransactions> recurring = transactionService.scheduleRecurringTransaction(transaction, startTime, intervalDays, numberOfRepetitions);
        return ResponseEntity.ok(recurring);
    }

    @PostMapping("/conditional")
    public ResponseEntity<?> conditionalTransaction(
            @RequestBody SimTransactions transaction,
            @RequestParam("balanceThreshold") double balanceThreshold
    ) {
        try {
            // Fetch the SimCardAccount from the database
            SimCardAccount simCardAccount = transactionService.getSimCardAccountById(transaction.getSimCardAccount().getSimCardId());
            transaction.setSimCardAccount(simCardAccount);

            // Add logging to inspect the transaction object
            System.out.println("Received Transaction: " + transaction);
            System.out.println("Balance Threshold: " + balanceThreshold);
            SimTransactions conditional = transactionService.conditionalTransaction(transaction, balanceThreshold);
            return ResponseEntity.ok(conditional);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/batch")
    public ResponseEntity<List<SimTransactions>> batchTransactions(@RequestBody List<SimTransactions> transactions) {
        List<SimTransactions> batch = transactionService.batchTransactions(transactions);
        return ResponseEntity.ok(batch);
    }
}
