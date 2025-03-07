package com.example.ibudgetproject.repositories.Investment;

import com.example.ibudgetproject.entities.Investment.PaymentWithdrawal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentWithdrawalRepository extends JpaRepository<PaymentWithdrawal,Long> {

PaymentWithdrawal findByUser_UserId(Long userId);
}

