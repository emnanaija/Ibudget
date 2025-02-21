package com.example.ibudgetproject.controllers.Transactions;

import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.services.Transactions.Interfaces.ISimCardAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/account")
public class    SimCardAccountController {
    @Autowired
    private ISimCardAccountService simCardAccountService;
    @GetMapping
    public @ResponseBody List<SimCardAccount> getAllSimCardAccounts() {
        List<SimCardAccount> accounts = simCardAccountService.getAllSimCardAccounts();
        System.out.println("those are all accounts :  " + accounts.size());
        return accounts;
    }
    @GetMapping("/{id}")
    public Optional<SimCardAccount> getSimCardAccountById(@PathVariable Long id) {
        return simCardAccountService.getSimCardAccountById(id);
    }
    @PostMapping
    public SimCardAccount createSimCardAccount(@RequestBody SimCardAccount simCardAccount) {
        return simCardAccountService.createSimCardAccount(simCardAccount);
    }
    @PutMapping("/{id}")
    public void updateSimCardAccount(@PathVariable Long id, @RequestBody SimCardAccount simCardAccount) {
//        return simCardAccountService.updateSimCardAccount(id, simCardAccount);
    }
    @DeleteMapping("/{id}")
    public void deleteSimCardAccount(@PathVariable Long id) {
        simCardAccountService.deleteSimCardAccount(id);
    }

    @GetMapping("/{simCardId}/predictTransactionVolumes")
    public double[] predictTransactionVolumes(
            @PathVariable Long simCardId,
            @RequestParam int numFutureMonths) {
        return simCardAccountService.predictTransactionVolumes(simCardId, numFutureMonths);

    }
    @GetMapping("/{simCardId}/optimizeBudget")
    public double optimizeBudget(
            @PathVariable Long simCardId,
            @RequestParam double totalBudget) {
        return simCardAccountService.optimizeBudget(simCardId, totalBudget);
    }
    @GetMapping("/{simCardId}/transactions")
    public Optional<SimCardAccount> getTransactionsByAccountId(@PathVariable Long simCardId) {
        return simCardAccountService.getSimCardAccountById(simCardId);
    }
}
