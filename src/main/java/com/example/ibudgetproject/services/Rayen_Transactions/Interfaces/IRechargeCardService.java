package com.example.ibudgetproject.services.Rayen_Transactions.Interfaces;

import com.example.ibudgetproject.entities.Rayen_Transactions.SimCardAccount;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;

public interface IRechargeCardService {
    SimCardAccount rechargeAccount(Long simCardId, String rechargeCode);

    @Transactional
    SimCardAccount rechargeAccountWithImage(Long simCardId, String imagePath) throws IOException;
}