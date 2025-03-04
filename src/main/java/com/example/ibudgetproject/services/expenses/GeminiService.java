package com.example.ibudgetproject.services.expenses;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    private final RestTemplate restTemplate = new RestTemplate();

    public String getSuggestions(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Corps de la requête JSON
            String requestBody = "{ \"contents\": [{ \"parts\": [{ \"text\": \"" + prompt + "\" }] }] }";

            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            // Crée l'URL avec la clé API
            String urlWithApiKey = GEMINI_API_URL + "?key=" + geminiApiKey;

            // Envoie la requête POST
            ResponseEntity<String> response = restTemplate.exchange(
                    urlWithApiKey, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            } else {
                return "Erreur : " + response.getStatusCode();
            }
        } catch (Exception e) {
            return "Erreur lors de la communication avec Gemini : " + e.getMessage();
        }
    }
}
