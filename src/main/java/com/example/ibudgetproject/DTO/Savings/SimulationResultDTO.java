package com.example.ibudgetproject.DTO.Savings;

import java.math.BigDecimal;
import java.util.List;

public class SimulationResultDTO {
    private BigDecimal moyenneSoldeFinal;
    private BigDecimal intervalleConfianceMin;
    private BigDecimal intervalleConfianceMax;
    private List<BigDecimal> simulations; // Liste des résultats des simulations

    public SimulationResultDTO(BigDecimal moyenneSoldeFinal, BigDecimal intervalleConfianceMin, BigDecimal intervalleConfianceMax, List<BigDecimal> simulations) {
        this.moyenneSoldeFinal = moyenneSoldeFinal;
        this.intervalleConfianceMin = intervalleConfianceMin;
        this.intervalleConfianceMax = intervalleConfianceMax;
        this.simulations = simulations;
    }

    public BigDecimal getMoyenneSoldeFinal() { return moyenneSoldeFinal; }
    public BigDecimal getIntervalleConfianceMin() { return intervalleConfianceMin; }
    public BigDecimal getIntervalleConfianceMax() { return intervalleConfianceMax; }
    public List<BigDecimal> getSimulations() { return simulations; }
}