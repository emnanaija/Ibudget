package com.example.ibudgetproject.controllers.expenses;

import com.example.ibudgetproject.services.expenses.FeteService;
import com.example.ibudgetproject.services.expenses.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/fetes")
public class FeteController {
    private static final Logger logger = LoggerFactory.getLogger(FeteController.class);


    private final FeteService feteService;


    @Autowired
    private GeminiService geminiService;

    public FeteController(FeteService feteService, GeminiService geminiService) {
        this.feteService = feteService;
        this.geminiService = geminiService;
    }


    /*@GetMapping("/{year}/{month}")
    public List<String> getFetesDuMois(@PathVariable int year, @PathVariable int month) {
        logger.info("📩 Requête reçue pour récupérer les fêtes du mois : Année={} Mois={}", year, month);

        List<String> fetes = feteService.getFetesDuMois(year, month);

        if (fetes.isEmpty()) {
            logger.warn("⚠️ Aucune fête trouvée pour {}/{}", month, year);
        } else {
            logger.info("✅ {} fêtes trouvées pour {}/{} : {}", fetes.size(), month, year, fetes);
        }

        return fetes;
    }*/

    @GetMapping("/{year}/{month}")
    public String getFetes(@PathVariable int year, @PathVariable int month) {
        // Récupérer toutes les fêtes du mois suivant
        List<String> fetes = feteService.getFetesDuMois(year, month );  // Le mois suivant

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
