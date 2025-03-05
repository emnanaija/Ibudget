package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.entities.Investment.Withdrawal;
import com.example.ibudgetproject.entities.User.User;

import java.util.List;

public interface WithdrawalService {

    Withdrawal requestWithdrawal(Long amount , User user);
    Withdrawal proceedWithWithdrawal(Long withdrawalId, boolean accept) throws Exception;
    List<Withdrawal> getUsersWithdrawalHistory(User user);
    List<Withdrawal>getAllWithdrawalRequest();

}
