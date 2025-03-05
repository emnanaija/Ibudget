package com.example.ibudgetproject.repositories.Investment;

import com.example.ibudgetproject.entities.Investment.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentServiceRepository extends JpaRepository<PaymentOrder,Long> {

}
