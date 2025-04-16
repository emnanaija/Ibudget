package com.example.ibudgetproject.entities.expenses;

import java.util.HashMap;
import java.util.Map;

public class FluctuationRateProvider {

    // Map statique associant une catégorie à un taux de fluctuation
    public static final Map<String, Double> fluctuationRates = new HashMap<>();

    static {
            fluctuationRates.put("Carburant", 0.3);     // 30%
            fluctuationRates.put("Alimentation", 0.4);  // 40%



        fluctuationRates.put("Transport", 0.15);      // 15%
        fluctuationRates.put("Loisirs", 0.12);        // 12%
        fluctuationRates.put("Logement", 0.10);       // 10%
        fluctuationRates.put("Santé", 0.08);          // 8%
        fluctuationRates.put("Abonnements", 0.10);    // 10%
        fluctuationRates.put("Assurance", 0.15);      // 15%
        fluctuationRates.put("Education", 0.12);      // 12%
        fluctuationRates.put("Télécommunications", 0.08); // 8%
        fluctuationRates.put("Impôts", 0.05);         // 5%
    }

    public static Double getFluctuationRate(String categoryName) {
        return fluctuationRates.getOrDefault(categoryName, 0.0);  // Retourne 0 si la catégorie n'est pas trouvée
    }
}
