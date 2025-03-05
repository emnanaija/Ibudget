package com.example.ibudgetproject.services.Investment;

import com.example.ibudgetproject.entities.Investment.Order;
import com.example.ibudgetproject.entities.Investment.Wallet;
import com.example.ibudgetproject.entities.User.User;

public interface WalletService {
    Wallet getUserWallet (User user);
    Wallet addBalance(Wallet wallet, Long money);
    Wallet findWalletById(Long id) throws Exception;
    Wallet WalletToWalletTransfer(User sender,Wallet recevierWallet,Long amount ) throws Exception;
    Wallet payOrderPayment (Order order,User user) throws Exception;
}
