package com.example.ibudgetproject.repositories.Transactions;

import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SimCardTransactionRepository extends JpaRepository<SimTransactions, Long> {

    List<SimTransactions> findBySenderOrReceiver(User sender, User receiver);

    List<SimTransactions> findBySimCardAccount_User_UserId(Long userId);

}
