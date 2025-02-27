package com.example.ibudgetproject.DTO.Savings;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PlanEpargneDTO {
    private BigDecimal montantObjectif;
    private LocalDate dateEstimee;
    private String recommendation;

    public PlanEpargneDTO(BigDecimal montantObjectif, LocalDate dateEstimee, String recommendation) {
        this.montantObjectif = montantObjectif;
        this.dateEstimee = dateEstimee;
        this.recommendation = recommendation;
    }

    // Getters et setters
    public BigDecimal getMontantObjectif() { return montantObjectif; }
    public void setMontantObjectif(BigDecimal montantObjectif) { this.montantObjectif = montantObjectif; }

    public LocalDate getDateEstimee() { return dateEstimee; }
    public void setDateEstimee(LocalDate dateEstimee) { this.dateEstimee = dateEstimee; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }
}

