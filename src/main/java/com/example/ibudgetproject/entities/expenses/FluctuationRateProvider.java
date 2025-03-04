package com.example.ibudgetproject.entities.expenses;

import java.util.HashMap;
import java.util.Map;

public class FluctuationRateProvider {

    // Map statique associant une catégorie à un taux de fluctuation
    public static final Map<String, Double> fluctuationRates = new HashMap<>();

    static {
        // Initialisation des taux de fluctuation pour chaque catégorie
        fluctuationRates.put("Alimentation", 0.05);   // 5% de fluctuation
        fluctuationRates.put("Transport", 0.03);      // 3% de fluctuation
        fluctuationRates.put("Loisirs", 0.02);        // 2% de fluctuation
        fluctuationRates.put("Logement", 0.02);       // 2% de fluctuation
        fluctuationRates.put("Santé", 0.01);          // 1% de fluctuation
        fluctuationRates.put("Abonnements", 0.01);    // 1% de fluctuation
        fluctuationRates.put("Assurance", 0.04);      // 4% de fluctuation
        fluctuationRates.put("Education", 0.03);      // 3% de fluctuation
        fluctuationRates.put("Télécommunications", 0.02); // 2% de fluctuation
        fluctuationRates.put("Impôts", 0.01);         // 1% de fluctuation
    }

    public static Double getFluctuationRate(String categoryName) {
        return fluctuationRates.getOrDefault(categoryName, 0.0);  // Retourne 0 si la catégorie n'est pas trouvée
    }
}
