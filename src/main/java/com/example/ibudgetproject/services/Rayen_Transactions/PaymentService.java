package com.example.ibudgetproject.services.Rayen_Transactions;

import com.example.ibudgetproject.entities.Rayen_Transactions.Payment;
import com.example.ibudgetproject.repositories.Rayen_Transactions.PaymentRepository;
import com.example.ibudgetproject.services.Rayen_Transactions.Interfaces.IPaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaymentService implements IPaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    @Override
    public Payment updatePayment(Long id, Payment paymentDetails) {
        if (paymentRepository.existsById(id)) {
            paymentDetails.setIdPayment(id);
            return paymentRepository.save(paymentDetails);
        }
        return null;
    }

    @Override
    public boolean deletePayment(Long id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
