package com.example.ibudgetproject.repositories.Investment;

import com.example.ibudgetproject.entities.Investment.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

;

public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    List<Withdrawal> findByUser_UserId(Long userId);
}
