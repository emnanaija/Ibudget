package com.example.ibudgetproject.repositories.Rayen_Transactions;


import com.example.ibudgetproject.entities.Rayen_Transactions.SimCardTransactions;
import com.example.ibudgetproject.entities.Rihab_User.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SimCardTransactionRepository extends JpaRepository<SimCardTransactions, Long> {

    List<SimCardTransactions> findBySenderOrReceiver(User sender, User receiver);

}
