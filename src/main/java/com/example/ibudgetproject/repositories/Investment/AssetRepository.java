package com.example.ibudgetproject.repositories.Investment;

import com.example.ibudgetproject.entities.Investment.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.ListResourceBundle;

public interface AssetRepository extends JpaRepository<Asset,Long> {
List<Asset> findByUser_UserId(Long userId);
Asset findByUser_UserIdAndCoinId(Long userId , String coinId);

}
