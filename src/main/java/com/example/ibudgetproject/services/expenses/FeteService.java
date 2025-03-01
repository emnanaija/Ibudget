package com.example.ibudgetproject.services.expenses;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

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

    public List<String> getFetesDuMois(int year, int month) {
        String url = API_URL + "?api_key=" + apiKey + "&country=" + country + "&year=" + year;
        logger.info("🔎 Envoi de la requête à Calendarific : {}", url);

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response != null && response.containsKey("response")) {
            List<Map<String, Object>> holidays = (List<Map<String, Object>>) ((Map<String, Object>) response.get("response")).get("holidays");

            logger.info("📆 {} fêtes trouvées dans la réponse API.", holidays.size());

            // Vérification des dates retournées
            for (Map<String, Object> holiday : holidays) {
                Map<String, Object> dateInfo = (Map<String, Object>) holiday.get("date");
                String dateIso = (String) dateInfo.get("iso"); // Format : "2025-02-14"
                logger.debug("🎉 Fête détectée   : {} - Date ISO : {}", holiday.get("name"), dateIso);
            }

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
}
