package com.example.ibudgetproject.repositories.Savings;
import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.entities.Savings.Depot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DepotRepository extends JpaRepository<Depot, Long>{
    List<Depot> findByFrequenceDepotIsNotNull();
    List<Depot> findByCompteEpargne(CompteEpargne compteEpargne);
    List<Depot> findByCompteEpargneId(Long compteEpargneId);
}
