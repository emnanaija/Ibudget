import { Component } from '@angular/core';
import { PredictionService } from '../../../../../services/prediction/Prediction.service';  // Assure-toi d'importer le service
import { FormsModule } from '@angular/forms';  // Ajoute cette ligne pour FormsModule
import { CommonModule } from '@angular/common'; // <-- AJOUTER

@Component({
  selector: 'app-prediction',
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.css'],
  standalone: true, // <-- AJOUTE CECI

  imports: [
    FormsModule ,
    CommonModule // Ajoute FormsModule ici
  ],
})
export class PredictionComponent {

  // Initialiser formData avec les valeurs par défaut
  formData: any = {
    montant: '',
    date: '', // Format yyyy-MM-dd directement lié à <input type="date">
    jour_semaine: '',
    frequence: '',
    lieu: ''
  };
  

  predictionResult: string | null = null;
  
  constructor(private predictionService: PredictionService) {}

  // Fonction pour appeler l'API avec les données de prédiction
  onPredictCategory(): void {
    // Log des données avant l'appel API
    console.log('Données envoyées pour la prédiction:', this.formData);

    // Appel du service pour prédire la catégorie
    this.predictionService.predictCategory(this.formData).subscribe(
      response => {
        // Log de la réponse de l'API
        console.log('Réponse de l\'API:', response);

        // Ici, tu récupères la réponse de l'API Spring (qui sera la catégorie prédite)
        this.predictionResult = response.categorie_predite;

        // Log de la catégorie prédite
        console.log('Catégorie prédite:', this.predictionResult);
      },
      error => {
        // Log de l'erreur si une exception se produit
        console.error('Erreur lors de la prédiction:', error);

        // Affichage du message d'erreur
        this.predictionResult = 'Erreur lors de la prédiction';
      }
    );
  }
}
