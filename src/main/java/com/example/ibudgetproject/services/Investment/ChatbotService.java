package com.example.ibudgetproject.services.Investment;


import com.example.ibudgetproject.Response.ChatbotInvestApiResponse;

public interface ChatbotService {
    ChatbotInvestApiResponse getCoinDetails(String prompt) throws Exception;

    String simpleChat(String prompt);

}

