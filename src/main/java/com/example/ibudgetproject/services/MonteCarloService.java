package com.example.ibudgetproject.services;


import com.example.ibudgetproject.entities.Transactions.SimCardAccount;
import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.example.ibudgetproject.services.Transactions.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class MonteCarloService {

    private static final int NUM_SIMULATIONS = 10000;

    @Autowired
    private AIService aiService;



    //function to predict volum of transactions
    public double[] predictTransactionVolumes(SimCardAccount account, int numFutureMonths) {
        List<SimTransactions> transactions = account.getTransactions();
        Random random = new Random();
        double[] forecastedVolumes = new double[numFutureMonths];

        transactions = aiService.cleanData(transactions);
        double[] optimizedParams = aiService.analyzeTransactionParameters(transactions);
        double avgVolume = optimizedParams[0];
        double stdDevVolume = optimizedParams[1];

        for (int month = 0; month < numFutureMonths; month++) {
            double totalVolume = 0.0;
            for (int i = 0; i < NUM_SIMULATIONS; i++) {
                double simulatedVolume = avgVolume + random.nextGaussian() * stdDevVolume;
                totalVolume += simulatedVolume;
            }
            forecastedVolumes[month] = totalVolume / NUM_SIMULATIONS;
        }

        // AI insights
        String insights = aiService.analyzeResults(forecastedVolumes);
        System.out.println("AI Insights: " + insights);

        // Display prediction with insights
        for (int i = 0; i < numFutureMonths; i++) {
            System.out.println("Month " + (i + 1) + ": " + forecastedVolumes[i] + " - " + insights);
        }

        return forecastedVolumes;
    }




    public double optimizeBudget(SimCardAccount account, double totalBudget) {
        List<SimTransactions> transactions = account.getTransactions();
        Random random = new Random();

        // Calculate historical average and standard deviation
        double avgAmount = transactions.stream()
                .mapToDouble(SimTransactions::getAmount)
                .average()
                .orElse(0.0);
        double stdDevAmount = Math.sqrt(transactions.stream()
                .mapToDouble(t -> Math.pow(t.getAmount() - avgAmount, 2))
                .average()
                .orElse(0.0));

        // Monte Carlo simulations for budget allocation
        double bestAllocation = 0.0;
        double minVariance = Double.MAX_VALUE;

        for (int i = 0; i < NUM_SIMULATIONS; i++) {
            double allocation = random.nextDouble() * totalBudget;
            double totalSpending = 0.0;

            for (SimTransactions transaction : transactions) {
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
