package com.example.ibudgetproject.repositories.Transactions;

import com.example.ibudgetproject.entities.Transactions.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    // Custom query to find the top 5 most recent bills
    @Query("SELECT b FROM Bill b ORDER BY b.dueDate DESC LIMIT 5")
    List<Bill> findTop5ByOrderByDueDateDesc();
}
