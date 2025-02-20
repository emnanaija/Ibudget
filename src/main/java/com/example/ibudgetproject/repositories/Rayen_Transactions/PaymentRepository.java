package com.example.ibudgetproject.repositories.Rayen_Transactions;

import com.example.ibudgetproject.entities.Rayen_Transactions.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
