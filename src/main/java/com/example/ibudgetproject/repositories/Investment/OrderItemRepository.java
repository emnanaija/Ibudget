package com.example.ibudgetproject.repositories.Investment;

import com.example.ibudgetproject.entities.Investment.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem,Long> {
}
