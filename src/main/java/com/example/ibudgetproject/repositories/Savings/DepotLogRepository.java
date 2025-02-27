package com.example.ibudgetproject.repositories.Savings;

import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.entities.Savings.DepotLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepotLogRepository extends JpaRepository<DepotLog, Long> {
    List<DepotLog> findByCompteEpargne(CompteEpargne compteEpargne);
}
