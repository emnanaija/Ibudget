package com.example.ibudgetproject.services.expenses;


import com.example.ibudgetproject.entities.expenses.SpendingWallet;
import com.example.ibudgetproject.entities.expenses.StatutWallet;
import com.example.ibudgetproject.repositories.expenses.SpendingWalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SpendingWalletService {

    @Autowired
    private SpendingWalletRepository walletRepository;

    // Créer un wallet avec statut ACTIF et solde à 0.0
    public SpendingWallet createWallet() {
        SpendingWallet wallet = new SpendingWallet();
        wallet.setSolde(0.0); // Solde initial
        wallet.setStatut(StatutWallet.ACTIF); // Statut par défaut : ACTIF
        wallet.setDateOuverture(LocalDate.now()); // Date d'ouverture : aujourd'hui
        return walletRepository.save(wallet);
    }

    // Désactiver un wallet
    public SpendingWallet deactivateWallet(Long id) {
        Optional<SpendingWallet> walletOptional = walletRepository.findById(id);
        if (walletOptional.isPresent()) {
            SpendingWallet wallet = walletOptional.get();
            wallet.setStatut(StatutWallet.INACTIF); // Changer le statut à INACTIF
            return walletRepository.save(wallet);
        } else {
            throw new RuntimeException("Wallet non trouvé !");
        }
    }

    public List<SpendingWallet> getAllWallets() {
        return walletRepository.findAll();
    }

    public SpendingWallet activateWallet(Long id) {
        Optional<SpendingWallet> walletOptional = walletRepository.findById(id);
        if (walletOptional.isPresent()) {
            SpendingWallet wallet = walletOptional.get();
            wallet.setStatut(StatutWallet.ACTIF); // Changer le statut à INACTIF
            return walletRepository.save(wallet);
        } else {
            throw new RuntimeException("Wallet non trouvé !");
        }
    }
}
