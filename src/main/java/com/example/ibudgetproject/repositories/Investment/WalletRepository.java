package com.example.ibudgetproject.repositories.Investment;

import com.example.ibudgetproject.entities.Investment.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository  extends JpaRepository<Wallet, Long> {
    Wallet findByUser_UserId(Long userId);
}
