package com.example.ibudgetproject.controllers.Transactions;


import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.services.Transactions.Interfaces.ISimCardTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}
