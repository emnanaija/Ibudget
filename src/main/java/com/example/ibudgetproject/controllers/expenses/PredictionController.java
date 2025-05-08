//package com.example.ibudgetproject.controllers.expenses;
//
//import com.example.ibudgetproject.services.expenses.PredictionService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.reactive.function.client.WebClient;
//import reactor.core.publisher.Mono;
//
//import java.util.Map;
//
//@RestController
//@CrossOrigin(origins = "http://localhost:5000")  // Assure-toi d'utiliser une origine valide
//@RequestMapping("/api/predictions")
//public class PredictionController {
//
//    @Autowired
//    private PredictionService predictionService;
//
//    @Autowired
//    private WebClient.Builder webClientBuilder;  // Injection du WebClient
//
//    @PostMapping("/predict")
//    public Mono<ResponseEntity<String>> predictCategory(@RequestBody Map<String, Object> inputData) {
//        // Créer et configurer WebClient avec la base URL
//        WebClient webClient = webClientBuilder.baseUrl("http://127.0.0.1:5000").build();
//
//        // Envoi de la requête à Flask via WebClient
//        return webClient.post()
//                .uri("/predict")
//                .bodyValue(inputData)
//                .retrieve()
//                .bodyToMono(String.class)
//                .map(predictedCategory -> ResponseEntity.ok(predictedCategory))
//                .onErrorResume(e -> Mono.just(ResponseEntity.status(500).body("Error: " + e.getMessage())));
//    }
//}
