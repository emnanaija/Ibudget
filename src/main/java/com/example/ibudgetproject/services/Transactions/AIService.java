package com.example.ibudgetproject.services.Transactions;

import com.example.ibudgetproject.entities.Transactions.SimTransactions;
import com.google.api.client.http.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.json.gson.GsonFactory;
import com.google.gson.Gson;
<<<<<<< Updated upstream
=======
import com.google.gson.GsonBuilder;
import com.google.gson.JsonSyntaxException;
import com.google.gson.TypeAdapter;
>>>>>>> Stashed changes
import com.google.gson.reflect.TypeToken;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {


    //import the api key for gemini +url (url+key will be sent to gemini + prompt msg )
    @Value("${gemini.api.key}")
    private String apiKey;
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final JsonFactory JSON_FACTORY = new GsonFactory();
    private static final Gson GSON = new Gson();


    //---------------------------------Rayen/Transactions---------------------------------------------------------------------------



    // assited data cleaning and fix
    public List<SimTransactions> cleanData(List<SimTransactions> transactions) {
        String prompt = "Analyze the following transactions and identify outliers: " + transactions.toString();
        String aiResponse = generateMessage(prompt);
        return transactions;
    }

    //assisted transaction analysis
    public double[] analyzeTransactionParameters(List<SimTransactions> transactions) {
        String prompt = "Analyze the following transactions and predict future averages and standard deviations: " + transactions.toString();
        String aiResponse = generateMessage(prompt);
        return new double[]{100.0, 15.0};
    }
<<<<<<< Updated upstream
//assisted results
    public String analyzeResults(double[] forecastedVolumes) {
        double avg = 0;
        for (double volume : forecastedVolumes) {
            avg += volume;
        }
        avg /= forecastedVolumes.length;
=======


    public Map<String, Object> analyzeResults(double[] forecastedVolumes) {
        double avg = Arrays.stream(forecastedVolumes).average().orElse(0.0);
>>>>>>> Stashed changes

        String evaluation;
        if (avg > 500) {
            evaluation = "High transaction volume expected. Consider monitoring for potential overspending.";
        } else if (avg > 200) {
            evaluation = "Moderate transaction volume. Keep an eye on spending trends.";
        } else {
            evaluation = "Low transaction volume. You may need to adjust budget expectations.";
        }

        String prompt = "Analyze the following forecasted transaction volumes and provide insights explain it like am 5 years old and use emojis: " + GSON.toJson(forecastedVolumes) +
                ". based on trends, offer financial advice make it short and simple : " + evaluation;

        return generateMessage(prompt);
    }
//-----------------------------------------------------------------------------------------------------------------

<<<<<<< Updated upstream
    // ai api call to generate message + prompt + timeout to avoid long waiting time
=======

    public Map<String, Object> cleanData(List<SimTransactions> transactions) {
        String prompt = "Analyze the following transactions and identify outliers. " +
                "Return a JSON object: {\"outlierIds\": [id1, id2, ...], \"message\": \"Explanation of outliers and tips\"}. " +
                GSON.toJson(transactions);
        String aiResponse = generateMessage(prompt);

        try {
            Type responseType = new TypeToken<Map<String, Object>>() {}.getType();
            Map<String, Object> responseMap = GSON.fromJson(aiResponse, responseType);

            List<Double> outlierIdsDouble = (List<Double>) responseMap.get("outlierIds");
            List<Long> outlierIds = outlierIdsDouble.stream().map(Double::longValue).collect(Collectors.toList());

            String message = (String) responseMap.get("message");

            List<SimTransactions> cleanedTransactions = transactions.stream()
                    .filter(t -> !outlierIds.contains(t.getIdTransaction()))
                    .collect(Collectors.toList());

            Map<String, Object> result = new HashMap<>();
            result.put("cleanedTransactions", cleanedTransactions);
            result.put("message", message);

            return result;
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("cleanedTransactions", transactions);
            result.put("message", "Error processing AI response: " + e.getMessage());
            return result;
        }
    }


    public Map<String, Object> analyzeTransactionParameters(List<SimTransactions> transactions) {
        String prompt = "Analyze the following transactions and predict future averages and standard deviations. " +
                "Return a JSON object: {\"average\": number, \"stdDev\": number, \"message\": \"Explanation and tips\"}. " +
                GSON.toJson(transactions);
        String aiResponse = generateMessage(prompt);

        try {
            Type responseType = new TypeToken<Map<String, Double>>() {}.getType();
            Map<String, Double> responseMap = GSON.fromJson(aiResponse, responseType);

            double average = responseMap.get("average");
            double stdDev = responseMap.get("stdDev");

            Type responseTypeString = new TypeToken<Map<String, String>>() {}.getType();
            Map<String, String> responseMapString = GSON.fromJson(aiResponse, responseTypeString);
            String message = responseMapString.get("message");

            Map<String, Object> result = new HashMap<>();
            result.put("average", average);
            result.put("stdDev", stdDev);
            result.put("message", message);

            return result;
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("average", 100.0);
            result.put("stdDev", 15.0);
            result.put("message", "Error processing AI response: " + e.getMessage());
            return result;
        }
    }


>>>>>>> Stashed changes
    public String generateMessage(String prompt) {
        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))));

            String jsonRequest = GSON.toJson(requestBody);

            HttpRequestFactory requestFactory = HTTP_TRANSPORT.createRequestFactory();
            GenericUrl url = new GenericUrl(GEMINI_API_URL + "?key=" + apiKey);
            HttpRequest request = requestFactory.buildPostRequest(url, ByteArrayContent.fromString("application/json", jsonRequest));
            request.setParser(new JsonObjectParser(JSON_FACTORY));

            request.setConnectTimeout(10000);
            request.setReadTimeout(15000);

            HttpResponse response = request.execute();
            return extractGeneratedText(response.parseAsString());
        } catch (IOException e) {
            throw new RuntimeException("Error calling Gemini API: " + e.getMessage(), e);
        }
    }

<<<<<<< Updated upstream
    //extract text from the generated ai output
=======
>>>>>>> Stashed changes
    private String extractGeneratedText(String jsonResponse) {
        try {
            Type responseType = new TypeToken<Map<String, Object>>() {}.getType();
            Map<String, Object> responseBody = GSON.fromJson(jsonResponse, responseType);

            if (responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    if (content != null && content.containsKey("parts")) {
                        List<Map<String, String>> parts = (List<Map<String, String>>) content.get("parts");
                        return parts.get(0).get("text");
                    }
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini API response: " + e.getMessage(), e);
        }
        return "No response generated.";
    }
}
