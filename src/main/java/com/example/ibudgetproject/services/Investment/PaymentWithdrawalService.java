package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.entities.Investment.PaymentWithdrawal;
import com.example.ibudgetproject.entities.User.User;

public interface PaymentWithdrawalService {
    public PaymentWithdrawal addPaymentWithdrawalDetails(String accountNumber, String HolderNameAccount, String fcs, String BankName, User user);

    public PaymentWithdrawal getUsersPaymentWithdrawalDetails(User user);

}
