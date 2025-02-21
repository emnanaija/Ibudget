package com.example.ibudgetproject.services.Transactions;


import com.example.ibudgetproject.entities.Transactions.RechargeCard;
import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.repositories.Transactions.RechargeCardRepository;
import com.example.ibudgetproject.repositories.Transactions.SimCardAccountRepository;
import com.example.ibudgetproject.services.Transactions.Interfaces.IRechargeCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class RechargeCardService implements IRechargeCardService {
    //repos instantiation
    @Autowired
    private RechargeCardRepository rechargeCardRepository;
    @Autowired
    private SimCardAccountRepository simCardAccountRepository;
    //services instantiation
    @Autowired
    private OCRService ocrService;
    @Autowired
    private NotificationService notificationService;
    @Override
    @Transactional
    public SimCardAccount rechargeAccount(Long simCardId, String rechargeCode) {
        // find rech card if it exits
        RechargeCard rechargeCard = rechargeCardRepository.findByCode(rechargeCode)
                .orElseThrow(() -> new RuntimeException("Recharge card not found with code: " + rechargeCode));
        // check if its used or not
        if (rechargeCard.isUsed()) {
            throw new RuntimeException("Card already used");
        }
        // find account
        SimCardAccount simCardAccount = simCardAccountRepository.findById(simCardId)
                .orElseThrow(() -> new RuntimeException("SimCardAccount not found with id: " + simCardId));
        // update balance
        double newBalance = simCardAccount.getBalance() + rechargeCard.getAmount();
        simCardAccount.setBalance(newBalance);
        // cared is used
        rechargeCard.setUsed(true);
        rechargeCard.setSimCardAccount(simCardAccount);
        // save
        rechargeCardRepository.save(rechargeCard);
        simCardAccountRepository.save(simCardAccount);

        // sms ai powered notif
        String message = String.format(
                "You recharged %.2f TND. Your balance is now %.2f TND.",
                rechargeCard.getAmount(), newBalance
        );
        //twilioService.sendSms(simCardAccount.getUser().getPhoneNumber(), message);
        notificationService.sendRechargeNotification(rechargeCard.getAmount(), newBalance, simCardAccount.getUser().getPhoneNumber());

        return simCardAccount;
    }

    @Override
    @Transactional
    public SimCardAccount rechargeAccountWithImage(Long simCardId, String imagePath) throws IOException {
        // text from image using ocr api
        String extractedText = ocrService.extractTextFromImage(imagePath);



        //check text eli extracteh ala terminal bech naarf l bug win
        System.out.println("Extracted text: " + extractedText);

        //extract the word from the photo (awl kelma )
        String rechargeCode = extractedText.split(" ")[0];
        // use the code to recharge account
        return rechargeAccount(simCardId, rechargeCode);
    }

    public List<RechargeCard> generateRechargeCards(int numberOfCards, double amount) {
        List<RechargeCard> rechargeCards = new ArrayList<>();
        for (int i = 0; i < numberOfCards; i++) {
            RechargeCard rechargeCard = new RechargeCard();
            rechargeCard.setCode(generateUniqueCode());
            rechargeCard.setAmount(amount);
            rechargeCard.setUsed(false);
            rechargeCards.add(rechargeCard);
        }
        return rechargeCardRepository.saveAll(rechargeCards);
    }

    private String generateUniqueCode() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }
}