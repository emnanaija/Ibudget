package com.example.ibudgetproject.services.expenses;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.ibudgetproject.services.expenses.GeminiService;
import java.util.LinkedHashSet;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import com.example.ibudgetproject.entities.expenses.feteRecommendation;

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

    private final GeminiService geminiService; // Injecter le service Gemini

    public FeteService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    // Méthode pour récupérer les fêtes du mois
    public List<String> getFetesDuMois(int year, int month) {
        String url = API_URL + "?api_key=" + apiKey + "&country=" + country + "&year=" + year;
        logger.info("Envoi de la requête à Calendarific : {}", url);

        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response != null && response.containsKey("response")) {
            List<Map<String, Object>> holidays = (List<Map<String, Object>>)
                    ((Map<String, Object>) response.get("response")).get("holidays");

            logger.info(" {} fêtes trouvées dans la réponse API.", holidays.size());

            List<String> fetesMois = holidays.stream()
                    .filter(h -> {
                        Map<String, Object> dateInfo = (Map<String, Object>) h.get("date");
                        String dateIso = (String) dateInfo.get("iso"); // Format "2025-02-14"
                        int monthInDate = Integer.parseInt(dateIso.substring(5, 7));
                        return monthInDate == month;
                    })
                    .map(h -> h.get("name").toString())
                    .collect(Collectors.toCollection(LinkedHashSet::new)) // Élimine les doublons tout en gardant l'ordre
                    .stream()
                    .collect(Collectors.toList());

            logger.info(" {} fêtes uniques correspondent au mois {}.", fetesMois.size(), month);
            return fetesMois;
        }

        logger.warn("⚠️ Aucun résultat renvoyé par l'API.");
        return List.of();
    }

    // Nouvelle méthode pour obtenir les recommandations pour les fêtes
    public List<feteRecommendation> getRecommandationsFetes() {
        // Obtenir la date actuelle
        LocalDate today = LocalDate.now();
        int year = today.getYear();
        int month = today.getMonthValue();

        // Récupérer toutes les fêtes du mois
        List<String> fetes = getFetesDuMois(year, month);

        List<feteRecommendation> recommandations = new ArrayList<>();

        if (!fetes.isEmpty()) {
            for (String fete : fetes) {
                // Créer les prompts pour Gemini pour chaque fête
                String budgetPrompt = "Propose-moi un budget pour la fête de " + fete +
                        " en dinars tunisien (une estimation approximative pour une famille de 5 personnes). " +
                        "Retourne-moi la réponse sous forme d'un objet JSON avec des catégories, chaque catégorie ayant un 'name' et un 'montant' et rajoute des emojis corepondants. sachant que voici ma focntion de conversion cote front extractJsonFromString(rawString: string): any {\n" +
                        "    try {\n" +
                        "      const parsed = JSON.parse(rawString);\n" +
                        "      const textContent = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;\n" +
                        "  \n" +
                        "      console.log('Texte extrait avant nettoyage:', textContent);  // Ajoutez ce log pour debugger\n" +
                        "  \n" +
                        "      if (textContent) {\n" +
                        "        return this.cleanAndParseJson(textContent);\n" +
                        "      }\n" +
                        "      return parsed;\n" +
                        "    } catch (error) {\n" +
                        "      console.error('Erreur lors du parsing principal:', error);\n" +
                        "      return null;\n" +
                        "    }\n" +
                        "  }\n" +
                        "  \n" +
                        "\n" +
                        "  private cleanAndParseJson(text: string): any {\n" +
                        "    try {\n" +
                        "      console.log('Texte avant nettoyage:', text);  // Log avant nettoyage\n" +
                        "  \n" +
                        "      const cleaned = text.replace(/```json|```/g, '').trim();\n" +
                        "  \n" +
                        "      console.log('Texte après nettoyage:', cleaned);  // Log après nettoyage\n" +
                        "  \n" +
                        "      const firstBrace = cleaned.indexOf('{');\n" +
                        "      const lastBrace = cleaned.lastIndexOf('}');\n" +
                        "      const jsonText = cleaned.substring(firstBrace, lastBrace + 1);\n" +
                        "  \n" +
                        "      return JSON.parse(jsonText);\n" +
                        "    } catch (error) {\n" +
                        "      console.error('Erreur de nettoyage ou parsing JSON brut:', error);\n" +
                        "      return null;\n" +
                        "    }\n" +
                        "  }\n" +
                        "  ";

                String cadeauxPrompt = "Quels sont des cadeaux populaires pour " + fete + "? Propose-moi des idées avec les prix en dinars tunisien. " +
                        "Retourne-moi la réponse sous forme d'un objet JSON avec des cadeaux, chaque cadeau ayant un 'name' et un 'price' et rajoute des emojis corepondants. sachant que je vveux faire lextraction cote front avec cette fonction extractJsonFromString(rawString: string): any {\n" +
                        "    try {\n" +
                        "      const parsed = JSON.parse(rawString);\n" +
                        "      const textContent = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;\n" +
                        "  \n" +
                        "      console.log('Texte extrait avant nettoyage:', textContent);  // Ajoutez ce log pour debugger\n" +
                        "  \n" +
                        "      if (textContent) {\n" +
                        "        return this.cleanAndParseJson(textContent);\n" +
                        "      }\n" +
                        "      return parsed;\n" +
                        "    } catch (error) {\n" +
                        "      console.error('Erreur lors du parsing principal:', error);\n" +
                        "      return null;\n" +
                        "    }\n" +
                        "  }\n" +
                        "  \n" +
                        "\n" +
                        "  private cleanAndParseJson(text: string): any {\n" +
                        "    try {\n" +
                        "      console.log('Texte avant nettoyage:', text);  // Log avant nettoyage\n" +
                        "  \n" +
                        "      const cleaned = text.replace(/```json|```/g, '').trim();\n" +
                        "  \n" +
                        "      console.log('Texte après nettoyage:', cleaned);  // Log après nettoyage\n" +
                        "  \n" +
                        "      const firstBrace = cleaned.indexOf('{');\n" +
                        "      const lastBrace = cleaned.lastIndexOf('}');\n" +
                        "      const jsonText = cleaned.substring(firstBrace, lastBrace + 1);\n" +
                        "  \n" +
                        "      return JSON.parse(jsonText);\n" +
                        "    } catch (error) {\n" +
                        "      console.error('Erreur de nettoyage ou parsing JSON brut:', error);\n" +
                        "      return null;\n" +
                        "    }\n" +
                        "  }\n" +
                        "  ";

                // Demander des suggestions à Gemini
                String budgetSuggestions = geminiService.getSuggestions(budgetPrompt);
                String cadeauxSuggestions = geminiService.getSuggestions(cadeauxPrompt);

                // Ajouter les suggestions à la liste des recommandations
                recommandations.add(new feteRecommendation(fete, budgetSuggestions, cadeauxSuggestions));
            }
        }

        return recommandations; // Retourner une liste d'objets JSON
    }

}