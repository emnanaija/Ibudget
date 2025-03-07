package com.example.ibudgetproject.Response;

import lombok.Data;

@Data
public class ChatbotInvestApiResponse {
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

