package com.example.ibudgetproject.repositories.Transactions;


import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.User.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SimCardAccountRepository extends JpaRepository<SimCardAccount, Long> {

    Optional<Object> findByUser(User systemUser);
}
