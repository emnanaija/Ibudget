package com.example.ibudgetproject.services.Rayen_Transactions;


import com.example.ibudgetproject.entities.Rayen_Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Rayen_Transactions.SimCardTransactions;
import com.example.ibudgetproject.entities.Rihab_User.User;
import com.example.ibudgetproject.repositories.Rayen_Transactions.SimCardAccountRepository;
import com.example.ibudgetproject.repositories.Rayen_Transactions.SimCardTransactionRepository;
import com.example.ibudgetproject.repositories.Rihab_User.UserRepository;
import com.example.ibudgetproject.services.Rayen_Transactions.Interfaces.ISimCardAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SimCardAccountService implements ISimCardAccountService {

    @Autowired
    private SimCardAccountRepository simCardAccountRepository;

    @Autowired
    private SimCardTransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MonteCarloService monteCarloService;

    @Override
    public List<SimCardAccount> getAllSimCardAccounts() {
        List<SimCardAccount> accounts = simCardAccountRepository.findAll();
        System.out.println("Accounts retrieved: " + accounts.size());
        return accounts;
    }

    @Override
    public Optional<SimCardAccount> getSimCardAccountById(Long id) {
        return simCardAccountRepository.findById(id);
    }

    @Override
    public SimCardAccount createSimCardAccount(SimCardAccount simCardAccount) {
        return simCardAccountRepository.save(simCardAccount);
    }

    @Override
    public void updateSimCardAccount(Long id, SimCardAccount updatedSimCardAccount) {
        simCardAccountRepository.findById(id).map(existingAccount -> {
            existingAccount.setBalance(updatedSimCardAccount.getBalance());
            existingAccount.setCurrency(updatedSimCardAccount.getCurrency());
            existingAccount.setUpdatedAt(updatedSimCardAccount.getUpdatedAt());
            return simCardAccountRepository.save(existingAccount);
        }).orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Override
    public void deleteSimCardAccount(Long id) {
        simCardAccountRepository.deleteById(id);
    }

    /**
     * Handle SimCard Transactions
     */
    public SimCardTransactions createTransaction(Long senderId, Long receiverId, double amount, String refNum, String desc) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Ensure sender has enough balance
        if (sender.getSimCardAccount().getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        // Create transaction
        SimCardTransactions transaction = new SimCardTransactions();
        transaction.setSender(sender);
        transaction.setReceiver(receiver);
        transaction.setAmount(amount);
        transaction.setRefNum(refNum);
        transaction.setDesc(desc);
        transaction.setTransactionDate(java.time.LocalDateTime.now());

        // Update balances
        sender.getSimCardAccount().setBalance(sender.getSimCardAccount().getBalance() - amount);
        receiver.getSimCardAccount().setBalance(receiver.getSimCardAccount().getBalance() + amount);

        // Save changes
        simCardAccountRepository.save(sender.getSimCardAccount());
        simCardAccountRepository.save(receiver.getSimCardAccount());

        return transactionRepository.save(transaction);
    }

    public List<SimCardTransactions> getTransactionsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return transactionRepository.findBySenderOrReceiver(user, user);
    }


    public double[] predictTransactionVolumes(Long simCardId, int numFutureMonths) {
        SimCardAccount account = simCardAccountRepository.findById(simCardId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + simCardId));
        return monteCarloService.predictTransactionVolumes(account, numFutureMonths);
    }

    public double optimizeBudget(Long simCardId, double totalBudget) {
        SimCardAccount account = simCardAccountRepository.findById(simCardId)
                .orElseThrow(() -> new RuntimeException("Account not found with id: " + simCardId));
        return monteCarloService.optimizeBudget(account, totalBudget);
    }
}
