package com.example.ibudgetproject.controllers.expenses;

import com.example.ibudgetproject.services.expenses.FeteService;
import com.example.ibudgetproject.services.expenses.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.ibudgetproject.entities.expenses.feteRecommendation;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@RestController
@CrossOrigin("*")
@RequestMapping("/api/fetes")
public class FeteController {
    private static final Logger logger = LoggerFactory.getLogger(FeteController.class);


    @Autowired
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
    @GetMapping("/current")
    public List<feteRecommendation> getFetes() {
        // Appeler le service pour obtenir les recommandations sous forme d'une liste
        List<feteRecommendation> fetes = feteService.getRecommandationsFetes();

        // Retirer les doublons si nécessaire
        Set<feteRecommendation> uniqueFetes = new HashSet<>(fetes);
        return new ArrayList<>(uniqueFetes);
    }



}
