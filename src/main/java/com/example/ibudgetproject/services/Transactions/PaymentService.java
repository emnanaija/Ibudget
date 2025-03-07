package com.example.ibudgetproject.services.Transactions;

import com.example.ibudgetproject.entities.Transactions.Bill;
import com.example.ibudgetproject.entities.Transactions.Payment;
import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Transactions.BillRepository;
import com.example.ibudgetproject.repositories.Transactions.PaymentRepository;
import com.example.ibudgetproject.repositories.Transactions.SimCardAccountRepository;
import com.example.ibudgetproject.repositories.Transactions.SimCardTransactionRepository;
import com.example.ibudgetproject.repositories.User.UserRepository;
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
    private SimCardTransactionRepository transactionRepository;

    @Autowired
    private SimCardAccountRepository simCardAccountRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Payment payBill(Long billId, String paymentMethod, String beneficiary, String comment, Double amountPaid) {
        // Fetch the bill
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + billId));

        // Fetch the system SimCardAccount (id = 1)
        SimCardAccount systemAccount = simCardAccountRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("System SimCardAccount not found"));

        // Fetch the user with id = 2 (owner of the system account)
        User systemUser = userRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("System user (id = 2) not found"));

        // Create a new SimTransactions entity
        SimTransactions transaction = new SimTransactions();
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setAmount(amountPaid);
        transaction.setStatus("SUCCESS"); // Set appropriate status
        transaction.setReceiver(systemUser); // Set the receiver as the system user (id = 2)
        transaction.setSimCardAccount(systemAccount); // Set the system account as the receiver's account

        // Save the transaction
        transactionRepository.save(transaction);

        // Update the system account balance
        systemAccount.setBalance(systemAccount.getBalance() + amountPaid);
        simCardAccountRepository.save(systemAccount);

        // Create a new payment
        Payment payment = new Payment();
        payment.setAmountPaid(amountPaid);
        payment.setPaymentMethod(paymentMethod);
        payment.setBeneficiary(beneficiary);
        payment.setComment(comment);
        payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus(true); // Assuming payment is successful
        payment.setBill(bill);
        payment.setTransaction(transaction); // Set the transaction

        // Update the bill status to "Paid"
        bill.setStatus("Paid");
        billRepository.save(bill);

        // Save the payment
        return paymentRepository.save(payment);
    }
}