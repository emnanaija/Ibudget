package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.entities.Investment.PaymentWithdrawal;
import com.example.ibudgetproject.entities.User.User;
import com.example.ibudgetproject.repositories.Investment.PaymentWithdrawalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PaymentWithdrawalServiceImpl implements PaymentWithdrawalService{
    @Autowired
    private PaymentWithdrawalRepository paymentWithdrawalRepository;
    @Override
    public PaymentWithdrawal addPaymentWithdrawalDetails(String accountNumber, String HolderNameAccount, String fcs, String BankName, User user) {
        PaymentWithdrawal paymentWithdrawal=new PaymentWithdrawal();

        paymentWithdrawal.setAccountNumber(accountNumber);
        paymentWithdrawal.setHolderNameAccount(HolderNameAccount);
        paymentWithdrawal.setFcs(fcs);
        paymentWithdrawal.setBankName(BankName);
        paymentWithdrawal.setUser(user);




        return paymentWithdrawalRepository.save(paymentWithdrawal);
    }

    @Override
    public PaymentWithdrawal getUsersPaymentWithdrawalDetails(User user) {
        return paymentWithdrawalRepository.findByUser_UserId(user.getUserId());
    }
}
