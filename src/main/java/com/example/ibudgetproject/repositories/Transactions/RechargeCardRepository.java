package com.example.ibudgetproject.repositories.Transactions;

import com.example.ibudgetproject.entities.Transactions.RechargeCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RechargeCardRepository extends JpaRepository<RechargeCard, Long> {
    Optional<RechargeCard> findByCode(String code); // Find a recharge card by its code
}