import { Component, OnInit } from '@angular/core';
import { FeteService } from '../../.././../../services/fetes/fete.service';
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
      const parsed = typeof rawString === 'string' ? JSON.parse(rawString) : rawString;
  
      // Sécurité : vérifie l'existence de "candidates"
      if (!parsed?.candidates || !Array.isArray(parsed.candidates) || parsed.candidates.length === 0) {
        console.warn("Pas de contenu valide dans candidates.");
        return null;
      }
  
      // Parcours des candidats pour trouver du texte JSON
      for (const candidate of parsed.candidates) {
        const textContent = candidate?.content?.parts?.[0]?.text;
        if (typeof textContent === 'string') {
          const cleaned = this.cleanAndParseJson(textContent);
          if (cleaned) return cleaned;
        }
      }
  
      // Fallback si aucun contenu JSON n'a été extrait
      console.warn("Aucun JSON valide extrait du contenu.");
      return null;
  
    } catch (error) {
      console.error('Erreur dans extractJsonFromString:', error);
      return null;
    }
  }
  
  private cleanAndParseJson(text: string): any {
    try {
      // Retirer les balises markdown s'il y en a
      text = text.replace(/```(?:json)?/g, '').trim();
  
      // On essaie de récupérer le premier bloc JSON
      const firstBrace = text.indexOf('{');
      const lastBrace = text.lastIndexOf('}');
  
      if (firstBrace === -1 || lastBrace === -1 || firstBrace >= lastBrace) {
        console.warn("Structure JSON absente ou incomplète.");
        return null;
      }
  
      const jsonText = text.substring(firstBrace, lastBrace + 1);
  
      // Double parsing si contenu JSON stringifié
      const parsed = JSON.parse(jsonText);
      if (typeof parsed === 'string') {
        return JSON.parse(parsed); // cas où on a un JSON doublement encodé
      }
  
      return parsed;
  
    } catch (error) {
      console.error('Erreur de parsing JSON brut:', error);
      return null;
    }
  }
  
}