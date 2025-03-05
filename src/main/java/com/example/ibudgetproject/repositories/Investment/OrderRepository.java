package com.example.ibudgetproject.repositories.Investment;

import com.example.ibudgetproject.entities.Investment.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order,Long> {
    List<Order> findByUser_UserId(Long userId);
}
