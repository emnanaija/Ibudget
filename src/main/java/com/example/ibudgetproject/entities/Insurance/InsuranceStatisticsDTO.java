package com.example.ibudgetproject.entities.Insurance;

import lombok.Data;

import java.util.Map;

@Data
// Dans InsuranceStatisticsDTO.java
public class InsuranceStatisticsDTO {
    private long totalPolicies;
    private long totalActiveInsurance;
    private long totalExpiredInsurance;
    private double averagePremium;
    private double totalPremiumCollected;
    private Map<String, Long> typeStatistics;

    // Getters et setters
    public long getTotalPolicies() { return totalPolicies; }
    public void setTotalPolicies(long totalPolicies) { this.totalPolicies = totalPolicies; }

    public long getTotalActiveInsurance() { return totalActiveInsurance; }
    public void setTotalActiveInsurance(long totalActiveInsurance) { this.totalActiveInsurance = totalActiveInsurance; }

    public long getTotalExpiredInsurance() { return totalExpiredInsurance; }
    public void setTotalExpiredInsurance(long totalExpiredInsurance) { this.totalExpiredInsurance = totalExpiredInsurance; }

    public double getAveragePremium() { return averagePremium; }
    public void setAveragePremium(double averagePremium) { this.averagePremium = averagePremium; }

    public double getTotalPremiumCollected() { return totalPremiumCollected; }
    public void setTotalPremiumCollected(double totalPremiumCollected) { this.totalPremiumCollected = totalPremiumCollected; }

    public Map<String, Long> getTypeStatistics() { return typeStatistics; }
    public void setTypeStatistics(Map<String, Long> typeStatistics) { this.typeStatistics = typeStatistics; }
}