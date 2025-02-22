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
        RechargeCard rechargeCard = rechargeCardRepository.findByCode(rechargeCode)
                .orElseThrow(() -> new RuntimeException("Recharge card not found with code: " + rechargeCode));

        if (rechargeCard.isUsed()) {
            throw new RuntimeException("Card already used");
        }

        SimCardAccount simCardAccount = simCardAccountRepository.findById(simCardId)
                .orElseThrow(() -> new RuntimeException("SimCardAccount not found with id: " + simCardId));

        double newBalance = simCardAccount.getBalance() + rechargeCard.getAmount();
        simCardAccount.setBalance(newBalance);

        rechargeCard.setUsed(true);
        rechargeCard.setSimCardAccount(simCardAccount);

        rechargeCardRepository.save(rechargeCard);
        simCardAccountRepository.save(simCardAccount);

        String message = String.format("You recharged %.2f TND. Your balance is now %.2f TND.",
                rechargeCard.getAmount(), newBalance);
        notificationService.sendRechargeNotification(rechargeCard.getAmount(), newBalance, simCardAccount.getUser().getPhoneNumber());

        return simCardAccount;
    }

    @Override
    @Transactional
    public SimCardAccount rechargeAccountWithImage(Long simCardId, String imagePath) throws IOException {
        String extractedText = ocrService.extractTextFromImage(imagePath);

        System.out.println("Extracted text (raw): " + extractedText); // Log the raw OCR output

        // Clean up the extracted text
        String cleanedText = extractedText.replaceAll("[^a-zA-Z0-9]", ""); // Remove non-alphanumeric chars

        System.out.println("Cleaned text: " + cleanedText);

        String rechargeCode = cleanedText.split(" ")[0]; // Take the first word
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