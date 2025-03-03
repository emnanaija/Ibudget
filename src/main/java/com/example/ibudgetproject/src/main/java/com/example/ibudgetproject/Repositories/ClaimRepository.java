package com.example.ibudgetproject.Repositories;

import com.example.ibudgetproject.Entities.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClaimRepository extends JpaRepository<Claim,Integer> {
}
