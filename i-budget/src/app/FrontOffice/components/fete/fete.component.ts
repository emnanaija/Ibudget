import { Component, OnInit } from '@angular/core';
import { FeteService } from '../../services/fetes/fete.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fete',
  templateUrl: './fete.component.html',
  styleUrls: ['./fete.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FeteComponent implements OnInit {
  recommandationsRaw: any[] = [];
  recommandations: any[] = [];

  constructor(private feteService: FeteService) {}

  ngOnInit(): void {
    this.feteService.getFetesRecommandations().subscribe(
      (response: any[]) => { 
        if (Array.isArray(response)) {
          this.recommandationsRaw = response;
          this.recommandations = this.recommandationsRaw.map((r: any) => ({
            fete: r.fete,
            budget: this.extractJsonFromString(r.budget),
            cadeaux: this.extractJsonFromString(r.cadeaux)
          }));
        } else {
          console.error('Réponse invalide reçue de l\'API.');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération des recommandations :', error);
      }
    );
  }
  
  extractJsonFromString(rawString: string): any {
    try {
      const parsed = JSON.parse(rawString);
      if (typeof parsed === 'object' && parsed !== null) {
        // Traitement des données spécifiques (comme candidates pour Gemini)
        return parsed.candidates?.[0]?.content?.parts?.[0]?.text ? 
          this.cleanAndParseJson(parsed.candidates[0].content.parts[0].text) : parsed;
      }
      return null;
    } catch (error) {
      console.error('Erreur parsing JSON:', error);
      return null;
    }
  }
  
  private cleanAndParseJson(text: string): any {
  const cleanedText = text.replace(/```json|```/g, '').trim();
  console.log('Texte nettoyé avant parsing:', cleanedText); // Affiche la chaîne nettoyée
  try {
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Erreur lors du nettoyage et parsing du texte:', error, cleanedText);
    return null;
  }
}

  
}
