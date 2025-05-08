//package com.example.ibudgetproject.services.expenses;
//
//import org.springframework.stereotype.Service;
//import org.springframework.web.reactive.function.client.WebClient;
//import reactor.core.publisher.Mono;
//
//import java.util.Map;
//
//@Service
//public class PredictionService {
//
//    private final WebClient.Builder webClientBuilder;
//
//    public PredictionService(WebClient.Builder webClientBuilder) {
//        this.webClientBuilder = webClientBuilder;
//    }
//
//    public Mono<String> predictCategory(Map<String, Object> inputData) {
//        return webClientBuilder.build()
//                .post()
//                .uri("http://127.0.0.1:5000/predict")
//                .bodyValue(inputData)
//                .retrieve()
//                .bodyToMono(String.class);  // Récupère la réponse sous forme de Mono (réactif)
//    }
//}
