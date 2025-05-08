import { Component, OnInit } from '@angular/core';
import { FeteService } from '../../../services/fetes/fete.service';
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
      const textContent = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
  
      console.log('Texte extrait avant nettoyage:', textContent);  // Ajoutez ce log pour debugger
  
      if (textContent) {
        return this.cleanAndParseJson(textContent);
      }
      return parsed;
    } catch (error) {
      console.error('Erreur lors du parsing principal:', error);
      return null;
    }
  }
  

  private cleanAndParseJson(text: string): any {
    try {
      console.log('Texte avant nettoyage:', text);  // Log avant nettoyage
  
      const cleaned = text.replace(/```json|```/g, '').trim();
  
      console.log('Texte après nettoyage:', cleaned);  // Log après nettoyage
  
      const firstBrace = cleaned.indexOf('{');
      const lastBrace = cleaned.lastIndexOf('}');
      const jsonText = cleaned.substring(firstBrace, lastBrace + 1);
  
      return JSON.parse(jsonText);
    } catch (error) {
      console.error('Erreur de nettoyage ou parsing JSON brut:', error);
      return null;
    }
  }
  

}