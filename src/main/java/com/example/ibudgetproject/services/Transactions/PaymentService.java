package com.example.ibudgetproject.services.Transactions;

import com.example.ibudgetproject.entities.Transactions.Bill;
import com.example.ibudgetproject.entities.Transactions.Payment;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;

import com.example.ibudgetproject.entities.Transactions.TransactionType;
import com.example.ibudgetproject.repositories.Transactions.BillRepository;
import com.example.ibudgetproject.repositories.Transactions.PaymentRepository;
import com.example.ibudgetproject.repositories.Transactions.SimCardTransactionRepository;
import com.example.ibudgetproject.services.Transactions.Interfaces.IPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService implements IPaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private SimCardTransactionRepository simTransactionsRepository;

    @Override
    public Payment payBill(Long billId, String paymentMethod, String beneficiary, String comment) {
        // Fetch the bill
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));

        // Create a new Payment
        Payment payment = new Payment();
        payment.setAmountPaid(bill.getAmount());
        payment.setPaymentMethod(paymentMethod);
        payment.setBeneficiary(beneficiary);
        payment.setComment(comment);
        payment.setPaymentStatus(true); // Assuming payment is successful
        payment.setValidationDate(LocalDateTime.now());
        payment.setBill(bill);

        // Create a new SimTransactions
        SimTransactions transaction = new SimTransactions();
        transaction.setAmount(bill.getAmount());
        transaction.setTransactionType(TransactionType.PAYMENT);
        transaction.setStatus("COMPLETED");
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setPayment(payment);

        // Save the SimTransactions first
        SimTransactions savedTransaction = simTransactionsRepository.save(transaction);

        // Associate the saved transaction with the payment
        payment.setTransaction(savedTransaction);

        // Save the Payment
        Payment savedPayment = paymentRepository.save(payment);

        // Update the bill status
        bill.setStatus("PAID");
        billRepository.save(bill);

        return savedPayment;
    }
}