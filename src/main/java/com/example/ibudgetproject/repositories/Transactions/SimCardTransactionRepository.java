package com.example.ibudgetproject.repositories.Transactions;


import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.User.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SimCardTransactionRepository extends JpaRepository<SimTransactions, Long> {

    List<SimTransactions> findBySenderOrReceiver(User sender, User receiver);

}
