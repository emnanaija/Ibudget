package com.example.ibudgetproject.services.Transactions;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TwilioService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    public void init() {
        Twilio.init(accountSid, authToken);
    }


    public void sendSms(String toPhoneNumber, String message) {
        init(); // Initialize Twilio
        Message.creator(
                new PhoneNumber(toPhoneNumber), // To
                new PhoneNumber(twilioPhoneNumber), // From
                message // Message body
        ).create();
    }
}