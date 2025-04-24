import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DepenseReccurenteService } from '../../services/depenses-reccurentes/depenses-reccurentes.service'; // Ton service de simulation

// Enregistrer les éléments nécessaires pour utiliser Chart.js
Chart.register(...registerables);

@Component({
  selector: 'app-depenses-simulation',
  templateUrl: './depenses-simulation-graph.component.html',
  styleUrls: ['./depenses-simulation-graph.component.css'],
})
export class DepensesSimulationComponent implements OnInit {
  simulationData: any; // Données de simulation

  constructor(private depensesSimulationService: DepenseReccurenteService) {}

  ngOnInit(): void {
    this.getSimulationData(); // Appeler la méthode pour récupérer les données
  }

  getSimulationData() {
    // Appeler le service pour récupérer les données de simulation
    this.depensesSimulationService.simulerDepensesParCategorie().subscribe(
      (data) => {
        this.simulationData = data; // Stocker les données dans la propriété simulationData
        this.createChart(); // Créer le graphique une fois les données récupérées
      },
      (error) => {
        console.error('Erreur lors de la récupération des données de simulation', error);
      }
    );
  }

  createChart() {
    if (!this.simulationData) return; // Si aucune donnée n'est disponible, on ne fait rien

    const labels = Object.keys(this.simulationData.nn); // Les mois (1 à 12)

    // Créer un tableau de datasets vide
    const datasets = [];

    // Itérer sur chaque catégorie dans les données de simulation
    for (const category in this.simulationData) {
      if (this.simulationData.hasOwnProperty(category)) {
        if (category !== 'nn' && category !== 'nnb') { // Exclure les catégories 'nn' et 'nnb'
          datasets.push({
            label: category, // Nom de la catégorie
            data: Object.values(this.simulationData[category]), // Valeurs des dépenses
            borderColor: this.getCategoryColor(category), // Couleur de la courbe
            backgroundColor: this.getCategoryColor(category, 0.3), // Couleur de fond de la courbe (transparente)
            fill: true, // Remplir sous la courbe
          });
        }
      }
    }

    // Créer le graphique avec Chart.js
    new Chart('depensesChart', {
      type: 'line', // Graphique en ligne
      data: {
        labels: labels, // Mois (1 à 12)
        datasets: datasets, // Les datasets générés dynamiquement
      },
      options: {
        responsive: true,
        scales: {
          x: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Fonction pour obtenir une couleur dynamique pour chaque catégorie
  getCategoryColor(category: string, alpha: number = 1): string {
    const colors: { [key: string]: string } = { // Index signature ajoutée ici
      'Alimentation': 'rgba(255, 87, 51', // Rouge
      'Carburant': 'rgba(76, 175, 80', // Vert
      'sportttttfv': 'rgba(33, 150, 243', // Bleu
      'other': 'rgba(255, 193, 7', // Jaune
      // Ajoute d'autres catégories si nécessaire
    };
  
    const baseColor = colors[category] || 'rgba(0, 0, 0'; // Si la catégorie n'est pas trouvée, couleur par défaut
    return `${baseColor}, ${alpha})`;
  }
}
