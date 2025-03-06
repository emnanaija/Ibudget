package com.example.ibudgetproject.repositories.Savings;
import com.example.ibudgetproject.entities.Savings.CompteEpargne;
import com.example.ibudgetproject.entities.User.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompteEpargneRepository extends JpaRepository<CompteEpargne, Long>{
    List<CompteEpargne> findByUser(User user);
}
