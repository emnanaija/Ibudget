package com.example.ibudgetproject.Services;

import com.example.ibudgetproject.Entities.InsurancePolicy;
import com.example.ibudgetproject.Entities.User;
import com.example.ibudgetproject.Repositories.InsuranceRepository;
import com.example.ibudgetproject.Repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


import org.springframework.http.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@AllArgsConstructor

public class GeminiService implements IGeminiService{

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    private final String apiKey = "AIzaSyBewFzBhs8qe4kL_sqX7b_4O2ISH3K14Yc"; // Clé API
    private final RestTemplate restTemplate = new RestTemplate();
    @Autowired
    private  InsuranceRepository insuranceRepository;

    @Autowired
    private  UserRepository userRepository;

    public double calculatePremium(int insuranceId) {
        Optional<InsurancePolicy> insuranceOpt = insuranceRepository.findById(insuranceId);

        if (insuranceOpt.isEmpty()) {
            throw new IllegalArgumentException("Insurance ID not found: " + insuranceId);
        }

        InsurancePolicy insurance = insuranceOpt.get();
        String prompt = "Calculate the insurance premium for a " + insurance.getUser().getAge() +
                " year old " + insurance.getUser().getProfession() +
                " with insurance type: " + insurance.getInsurance_type() + " and details: " + insurance.getDetails();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                GEMINI_API_URL + "?key=" + apiKey, HttpMethod.POST, entity, Map.class);

        if (response.getBody() != null && response.getBody().containsKey("candidates")) {
            String outputText = response.getBody().get("candidates").toString();
            double premium = extractPremiumFromText(outputText);
            return premium;
        }

        return 0.0;
    }

    public double extractPremiumFromText(String text) {
        Pattern pattern = Pattern.compile("\\d+(\\.\\d+)?");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            try {
                return Double.parseDouble(matcher.group());
            } catch (NumberFormatException e) {
                throw new RuntimeException("Failed to parse premium as double: " + matcher.group(), e);
            }
        } else {
            throw new RuntimeException("Premium not found in Gemini API response: " + text);
        }
    }

    public double estimateAmount(String documentText, String claimName, String claimDescription) {
        String prompt = "Estimate the monetary amount associated with the following claim based on the document text. " +
                "Claim Name: " + claimName + ". " +
                "Claim Description: " + claimDescription + ". " +
                "Document Text: " + documentText + ". " +
                "Provide only the estimated amount as a numerical value.";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                GEMINI_API_URL + "?key=" + apiKey, HttpMethod.POST, entity, Map.class);

        if (response.getBody() != null && response.getBody().containsKey("candidates")) {
            String outputText = response.getBody().get("candidates").toString();
            return extractAmountFromText(outputText);
        }

        return 0.0;
    }

    public double extractAmountFromText(String text) {
        try {
            return Double.parseDouble(text.replaceAll("[^0-9.]", ""));
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }


    public String generateTunisianNotification(InsurancePolicy policy, String specialDateName) {
        String prompt = "Crée une notification en dialecte tunisien avec des emojis pour informer un client que son contrat d'assurance numéro " +
                policy.getPolicy_number() + " a été souscrit le jour de " + specialDateName +
                " et qu'il a bénéficié d'une réduction de 10% sur sa prime. Inclut des détails sur la date et la réduction.";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.exchange(
                GEMINI_API_URL + "?key=" + apiKey, HttpMethod.POST, entity, Map.class);

        if (response.getBody() != null && response.getBody().containsKey("candidates")) {
            String outputText = response.getBody().get("candidates").toString();
            return extractNotificationText(outputText);
        }

        return "Notification non générée.";
    }

    private String extractNotificationText(String text) {
        // Supprimez les crochets, guillemets et autres caractères inutiles de la réponse de l'API
        return text.replaceAll("[\\[\\]{}\"']", "").trim();
    }
}
