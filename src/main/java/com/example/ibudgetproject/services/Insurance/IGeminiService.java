package com.example.ibudgetproject.services.Insurance;

public interface IGeminiService {

    double calculatePremium(int id ) ;
    double extractPremiumFromText(String text) ;
    double extractAmountFromText(String text);
    double estimateAmount(String documentText, String claimName, String claimDescription) ;
}
