package com.example.ibudgetproject.services;

import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.services.Transactions.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class MonteCarloService {

    private static final int NUM_SIMULATIONS = 10000;

    @Autowired
    private AIService aiService;

    public Map<String, Object> predictTransactionVolumes(SimCardAccount account, int numFutureMonths) {
        List<SimTransactions> transactions = account.getTransactions();
        Random random = new Random();
        double[] forecastedVolumes = new double[numFutureMonths];

        // 1. AI-Powered Data Cleaning
        Map<String, Object> cleanedDataResult = aiService.cleanData(transactions);
        List<SimTransactions> cleanedTransactions = (List<SimTransactions>) cleanedDataResult.get("cleanedTransactions");
        String cleaningMessage = (String) cleanedDataResult.get("message");

        // 2. AI-Powered Parameter Analysis
        Map<String, Object> analysisResult = aiService.analyzeTransactionParameters(cleanedTransactions);
        double avgVolume = (double) analysisResult.get("average");
        double stdDevVolume = (double) analysisResult.get("stdDev");
        String analysisMessage = (String) analysisResult.get("message");

        for (int month = 0; month < numFutureMonths; month++) {
            double totalVolume = 0.0;
            for (int i = 0; i < NUM_SIMULATIONS; i++) {
                double simulatedVolume = avgVolume + random.nextGaussian() * stdDevVolume;
                totalVolume += simulatedVolume;
            }
            forecastedVolumes[month] = totalVolume / NUM_SIMULATIONS;
        }

        // 3. AI-Powered Result Interpretation
        Map<String, Object> forecastResult = aiService.analyzeResults(forecastedVolumes);
        String forecastMessage = (String) forecastResult.get("message");

        // Build the response map
        Map<String, Object> response = new java.util.HashMap<>();
        response.put("forecastedVolumes", forecastedVolumes);
        response.put("cleaningMessage", cleaningMessage);
        response.put("analysisMessage", analysisMessage);
        response.put("forecastMessage", forecastMessage);

        return response;
    }

    public double optimizeBudget(SimCardAccount account, double totalBudget) {
        List<SimTransactions> transactions = account.getTransactions();
        Random random = new Random();

        // 1. AI-Powered Data Cleaning
        Map<String, Object> cleanedDataResult = aiService.cleanData(transactions);
        List<SimTransactions> cleanedTransactions = (List<SimTransactions>) cleanedDataResult.get("cleanedTransactions");

        // 2. AI-Powered Parameter Analysis
        Map<String, Object> analysisResult = aiService.analyzeTransactionParameters(cleanedTransactions);
        double avgAmount = (double) analysisResult.get("average");
        double stdDevAmount = (double) analysisResult.get("stdDev");

        // Monte Carlo simulations for budget allocation
        double bestAllocation = 0.0;
        double minVariance = Double.MAX_VALUE;

        for (int i = 0; i < NUM_SIMULATIONS; i++) {
            double allocation = random.nextDouble() * totalBudget;
            double totalSpending = 0.0;

            for (SimTransactions transaction : cleanedTransactions) {
                double simulatedAmount = avgAmount + random.nextGaussian() * stdDevAmount;
                totalSpending += Math.min(simulatedAmount, allocation);
            }

            double variance = Math.pow(totalSpending - totalBudget, 2);
            if (variance < minVariance) {
                minVariance = variance;
                bestAllocation = allocation;
            }
        }

        return bestAllocation;
    }
}