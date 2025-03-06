package com.example.ibudgetproject.services.User;

import com.example.ibudgetproject.entities.User.FinancialKnowledgeLevel;
import com.example.ibudgetproject.entities.User.Tone;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
@Getter
@Setter
public class ChatService {

    @Value("${chat.api.key}")
    private  String apiKey;


    public  String generateFinancialAdvice(String userQuestion, Tone aiTonePreference, FinancialKnowledgeLevel financialKnowledgeLevel) throws IOException, InterruptedException {

        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;


        String prompt = buildPrompt(userQuestion, aiTonePreference, financialKnowledgeLevel);

        JsonObject requestBody = new JsonObject();
        JsonObject contents = new JsonObject();
        JsonArray parts = new JsonArray();
        JsonObject part = new JsonObject();
        part.addProperty("text", prompt);
        parts.add(part);
        contents.add("parts", parts);
        requestBody.add("contents", contents);

        JsonObject generationConfig = new JsonObject();
        generationConfig.addProperty("temperature", 0.4); // Adjust as needed
        generationConfig.addProperty("maxOutputTokens", 2048); // Adjust as needed
        requestBody.add("generationConfig", generationConfig);

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(apiUrl))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody.toString()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200) {
            Gson gson = new Gson();
            JsonObject jsonResponse = gson.fromJson(response.body(), JsonObject.class);
            JsonArray candidates = jsonResponse.getAsJsonArray("candidates");
            if (candidates != null && candidates.size() > 0) {
                JsonObject content = candidates.get(0).getAsJsonObject().getAsJsonObject("content");
                if (content != null) {
                    JsonArray responseParts = content.getAsJsonArray("parts");
                    if (responseParts != null && responseParts.size() > 0) {
                        return responseParts.get(0).getAsJsonObject().get("text").getAsString();
                    }
                }
            }
            return "Sorry, I couldn't generate a response.";

        } else {
            return "Error: " + response.statusCode() + " - " + response.body();
        }
    }

    private  String buildPrompt(String userQuestion, Tone aiTonePreference, FinancialKnowledgeLevel financialKnowledgeLevel) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("You are a chatbot and financial advisor of an application called IBUDGET .IBudget is a financial application designed for low-income individuals in Tunisia, offering accessible and affordable financial services. Users can choose between a freemium or premium account. With the freemium plan, they can open a virtual checking or savings account, fund them with tickets to convert into virtual money, invest small amounts using a Robinhood-style approach, pay bills, and receive financial advice, all while benefiting from low transaction fees. The premium plan includes all these features plus an investment insurance that reimburses a percentage of lost funds in case of investment failure. IBudget empowers users to manage their finances, grow their income, and secure their future within the Tunisian economic context.");
        promptBuilder.append("Detect the language of the question and answer in the same language, if the language is tunisian arabic, please answer in derja.Answer the following question based on the user's financial knowledge level and preferred tone:\n\n");
        promptBuilder.append("User's Knowledge Level: ").append(financialKnowledgeLevel.toString()).append("\n");
        promptBuilder.append("User's Knowledge Level: ").append(financialKnowledgeLevel.toString()).append("\n");
        promptBuilder.append("Preferred Tone: ").append(aiTonePreference.toString()).append("\n\n");
        promptBuilder.append("Question: ").append(userQuestion).append("\n\n");
        promptBuilder.append("Answer in a ").append(aiTonePreference.toString().toLowerCase()).append(" tone, appropriate for a ").append(financialKnowledgeLevel.toString().toLowerCase()).append(" level. Provide practical and relevant financial advice.");

        return promptBuilder.toString();
    }

}
