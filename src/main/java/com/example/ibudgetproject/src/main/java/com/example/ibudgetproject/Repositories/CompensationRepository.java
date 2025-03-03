package com.example.ibudgetproject.Repositories;

import com.example.ibudgetproject.Entities.Compensation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompensationRepository extends JpaRepository<Compensation,Integer> {
}
