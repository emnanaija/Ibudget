package com.example.ibudget.Repository;

import com.example.ibudget.Entity.ConnexionInformation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConnexionInfoRepository extends JpaRepository<ConnexionInformation,Integer> {
}
