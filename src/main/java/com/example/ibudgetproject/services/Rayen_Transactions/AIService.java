package com.example.ibudgetproject.services.Rayen_Transactions;

import com.example.ibudgetproject.entities.Rayen_Transactions.SimCardTransactions;
import com.google.api.client.http.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.json.gson.GsonFactory;
import com.google.gson.Gson;
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
    public List<SimCardTransactions> cleanData(List<SimCardTransactions> transactions) {
        String prompt = "Analyze the following transactions and identify outliers: " + transactions.toString();
        String aiResponse = generateMessage(prompt);
        return transactions;
    }

    //assisted transaction analysis
    public double[] analyzeTransactionParameters(List<SimCardTransactions> transactions) {
        String prompt = "Analyze the following transactions and predict future averages and standard deviations: " + transactions.toString();
        String aiResponse = generateMessage(prompt);
        return new double[]{100.0, 15.0};
    }
//assisted results
    public String analyzeResults(double[] forecastedVolumes) {
        double avg = 0;
        for (double volume : forecastedVolumes) {
            avg += volume;
        }
        avg /= forecastedVolumes.length;

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

    // ai api call to generate message + prompt + timeout to avoid long waiting time
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

    //extract text from the generated ai output
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
