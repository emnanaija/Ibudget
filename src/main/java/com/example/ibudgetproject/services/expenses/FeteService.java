package com.example.ibudgetproject.services.expenses;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.ibudgetproject.services.expenses.GeminiService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FeteService {
    private static final Logger logger = LoggerFactory.getLogger(FeteService.class);

    private final RestTemplate restTemplate = new RestTemplate();

    // Injection de la clé API et du pays depuis le fichier application.properties
    @Value("${calendarific.api.key}")
    private String apiKey;

    @Value("${calendarific.country}")
    private String country;

    private static final String API_URL = "https://calendarific.com/api/v2/holidays";

    private final GeminiService geminiService; // Injecter le service Gemini

    public FeteService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    // Méthode pour récupérer les fêtes du mois
    public List<String> getFetesDuMois(int year, int month) {
        String url = API_URL + "?api_key=" + apiKey + "&country=" + country + "&year=" + year;
        logger.info("🔎 Envoi de la requête à Calendarific : {}", url);

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response != null && response.containsKey("response")) {
            List<Map<String, Object>> holidays = (List<Map<String, Object>>) ((Map<String, Object>) response.get("response")).get("holidays");

            logger.info("📆 {} fêtes trouvées dans la réponse API.", holidays.size());

            // Filtrer les fêtes du mois donné
            List<String> fetesMois = holidays.stream()
                    .filter(h -> {
                        Map<String, Object> dateInfo = (Map<String, Object>) h.get("date");
                        String dateIso = (String) dateInfo.get("iso"); // Format "2025-02-14"
                        int monthInDate = Integer.parseInt(dateIso.substring(5, 7)); // Extraire "02"
                        return monthInDate == month;
                    })
                    .map(h -> h.get("name").toString())
                    .collect(Collectors.toList());

            logger.info("✅ {} fêtes correspondent au mois {}.", fetesMois.size(), month);
            return fetesMois;
        }

        logger.warn("⚠️ Aucun résultat renvoyé par l'API.");
        return List.of();
    }

    // Nouvelle méthode pour obtenir les recommandations pour les fêtes
    public String getRecommandationsFetes(int year, int month) {
        // Récupérer toutes les fêtes du mois
        List<String> fetes = getFetesDuMois(year, month);

        if (!fetes.isEmpty()) {
            StringBuilder recommendations = new StringBuilder(); // Utilisation de StringBuilder pour concaténer les résultats

            for (String fete : fetes) {
                // Créer les prompts pour Gemini pour chaque fête
                String budgetPrompt = "Propose-moi un budget pour la fête de " + fete +
                        " en dinars tunisien (une estimation approximative pour une famille de 5 personnes). Réponds-moi avec les montants et la description seulement.";
                String cadeauxPrompt = "Quels sont des cadeaux populaires pour " + fete + "? Propose-moi des idées avec les prix en dinars.";

                // Demander des suggestions à Gemini
                String budgetSuggestions = geminiService.getSuggestions(budgetPrompt);
                String cadeauxSuggestions = geminiService.getSuggestions(cadeauxPrompt);

                // Ajouter les suggestions à la réponse
                recommendations.append("Suggestions pour la fête de ").append(fete).append(" :\n")
                        .append("Budget : ").append(budgetSuggestions).append("\n")
                        .append("Cadeaux : ").append(cadeauxSuggestions).append("\n\n");
            }

            return recommendations.toString(); // Retourner toutes les suggestions
        } else {
            return "Aucune fête trouvée pour " + month + "/" + year;
        }
    }
}
