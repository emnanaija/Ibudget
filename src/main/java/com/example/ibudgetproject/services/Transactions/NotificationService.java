package com.example.ibudgetproject.services.Transactions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    //instances
    @Autowired
    private AIService aiService;
    @Autowired
    private TwilioService twilioService;


    //functions related to transactions
    public void sendTransactionNotification(String senderName, String receiverName, double amount, String phoneNumber) {
        String prompt = String.format(
                "Generate a friendly SMS notification for a transaction. " +
                        "Sender: %s, Receiver: %s, Amount: %.2f TND.",
                senderName, receiverName, amount
        );

        String message = aiService.generateMessage(prompt);
        twilioService.sendSms(phoneNumber, message);
    }
    //functions related to recharge
    public void sendRechargeNotification(double amount, double balance, String phoneNumber) {
        String prompt = String.format(
                "Generate a friendly SMS notification for a recharge. (use some emojis) " +
                        "Amount: %.2f TND, New Balance: %.2f TND.",
                amount, balance
        );

        String message = aiService.generateMessage(prompt);
        twilioService.sendSms(phoneNumber, message);
    }
}