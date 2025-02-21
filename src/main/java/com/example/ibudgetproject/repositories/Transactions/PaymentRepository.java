package com.example.ibudgetproject.repositories.Transactions;

import com.example.ibudgetproject.entities.Transactions.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
