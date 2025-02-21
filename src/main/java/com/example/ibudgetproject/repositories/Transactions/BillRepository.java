package com.example.ibudgetproject.repositories.Transactions;

import com.example.ibudgetproject.entities.Transactions.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {
}
