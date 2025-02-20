package com.example.ibudgetproject.services.Rayen_Transactions.Interfaces;


import com.example.ibudgetproject.entities.Rayen_Transactions.Payment;

import java.util.List;
import java.util.Optional;

public interface IPaymentService {

    Payment createPayment(Payment payment);

    List<Payment> getAllPayments();

    Optional<Payment> getPaymentById(Long id);

    Payment updatePayment(Long id, Payment paymentDetails);

    boolean deletePayment(Long id);
}
