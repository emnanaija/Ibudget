package com.example.ibudgetproject.services.Transactions.Interfaces;

import com.example.ibudgetproject.entities.Transactions.Payment;

public interface IPaymentService {
    Payment payBill(Long billId, String paymentMethod, String beneficiary, String comment, Double amountPaid);
}