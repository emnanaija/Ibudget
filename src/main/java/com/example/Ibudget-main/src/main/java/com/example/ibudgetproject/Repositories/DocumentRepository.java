package com.example.ibudgetproject.Repositories;

import com.example.ibudgetproject.Entities.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document,Long> {

    List<Document> findByClaimId(int claimId);
}
