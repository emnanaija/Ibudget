// monte-carlo-simulation.component.ts
import { Component, OnInit } from '@angular/core';
import { CompteEpargneService } from '../../../../../../services/saving/compte-epargne.service';
import { MonteCarloService } from '../../../../../../services/saving/monte-carlo.service';
import { CompteEpargne } from '../../../../../../Models/Saving/compte-epargne.model';
import { SimulationResult } from '../../../../../../Models/Saving/simulation-result.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables,ScriptableContext } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-monte-carlo-simulation',
  standalone: true,
  templateUrl: './monte-carlo-simulation.component.html',
  styleUrls: ['./monte-carlo-simulation.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class MonteCarloSimulationComponent implements OnInit {
  simulationForm: FormGroup;
  comptesEpargne: CompteEpargne[] = [];
  simulationResult: SimulationResult | null = null;
  loading = false;
  error = '';
  chartInstance: Chart | null = null;
  submitted = false;

  constructor(
    private compteEpargneService: CompteEpargneService,
    private monteCarloService: MonteCarloService,
    private fb: FormBuilder
  ) {
    this.simulationForm = this.fb.group({
      compteId: [null, Validators.required],
      dureeAnnees: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
    });
  }

  ngOnInit(): void {
    this.loadComptesEpargne();
  }

  loadComptesEpargne(): void {
    this.loading = true;
    this.error = '';
    this.compteEpargneService.getUserComptes().subscribe(
      (comptes) => {
        this.comptesEpargne = comptes;
        this.loading = false;
      },
      (error) => {
        this.error = 'Erreur lors du chargement des comptes épargne.';
        console.error('Erreur de chargement des comptes:', error);
        this.loading = false;
      }
    );
  }

  simuler(): void {
    this.submitted = true;
    if (this.simulationForm.valid) {
      this.loading = true;
      this.error = '';
      this.simulationResult = null;
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }

      const compteId = this.simulationForm.get('compteId')!.value;
      const dureeAnnees = this.simulationForm.get('dureeAnnees')!.value;

      this.monteCarloService.simulerMonteCarlo(compteId, dureeAnnees).subscribe(
        (result) => {
          this.simulationResult = result;
          console.log('Simulation Result:', this.simulationResult)
          console.log('Simulations Data:', this.simulationResult.simulations)
          this.loading = false;
          setTimeout(() => {
            this.createChart();
          }, 500);
        },
        (error) => {
          this.error = 'Erreur lors de la simulation Monte Carlo.';
          console.error('Erreur de simulation:', error);
          this.loading = false;
        }
      );
    } else {
      this.error = 'Veuillez sélectionner un compte et une durée valides.';
    }
  }

  createChart(): void {
    if (this.simulationResult && this.simulationResult.simulations) {
      const dureeAnnees = this.simulationForm.get('dureeAnnees')!.value;
      let labels: string[];

      if (dureeAnnees < 5) {
        // Afficher en mois
        labels = Array.from({ length: dureeAnnees * 12 }, (_, index) => `Mois ${index + 1}`);
      } else {
        // Afficher en années
        labels = Array.from({ length: dureeAnnees }, (_, index) => `Année ${index + 1}`);
      }

      const datasets = [
        {
          label: 'Solde Estimé Moyen',
          // Ici, nous allons simuler une évolution basée sur la moyenne finale
          data: this.generateEvolutionData(
            Number(this.simulationResult.moyenneSoldeFinal),
            dureeAnnees
          ),
          borderColor: 'rgba(54, 162, 235, 1)', // Couleur bleue
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.2,
          fill: false,
        },
      ];

      const canvas = document.getElementById('monteCarloChart') as HTMLCanvasElement;
      const ctx = canvas?.getContext('2d');

      if (ctx) {
        this.chartInstance = new Chart(ctx, {
          type: 'line',
          data: { labels, datasets },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                callbacks: {
                  label: (context: any) => {
                    let label = context.dataset.label || '';
                    if (context.parsed.y !== null) {
                      label += `: ${context.parsed.y.toFixed(2)} DT`;
                    }
                    return label;
                  },
                },
              },
              legend: {
                position: 'top',
                labels: {
                  color: '#fff',
                  usePointStyle: true,
                  pointStyle: 'circle',
                  font: {
                    size: 12,
                    weight: 'bold'
                  }
                }
              },
              title: {
                display: true,
                text: `Évolution Estimée du Solde sur ${dureeAnnees < 5 ? dureeAnnees * 12 + ' Mois' : dureeAnnees + ' Ans'}`,
                color: '#fff',
                font: {
                  size: 16,
                  weight: 'bold'
                }
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: dureeAnnees < 5 ? 'Mois' : 'Années',
                  color: '#fff',
                  font: { size: 14, weight: 'bold' }
                },
                ticks: {
                  color: '#fff',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Solde (DT)',
                  color: '#fff',
                  font: { size: 14, weight: 'bold' }
                },
                ticks: {
                  color: '#fff',
                  callback: value => value + ' DT'
                }
              },
            },
          }
        });
      } else {
        console.error('Erreur lors de l\'obtention du contexte du canvas.');
      }
    }
  }

  // Fonction pour simuler une évolution linéaire basée sur la moyenne finale
  private generateEvolutionData(moyenneFinale: number, dureeAnnees: number): number[] {
    const data: number[] = [];
    const steps = dureeAnnees < 5 ? dureeAnnees * 12 : dureeAnnees;
    // Nous faisons une simple interpolation linéaire ici.
    // Une approche plus précise nécessiterait des informations sur le solde initial et les dépôts.
    for (let i = 0; i <= steps; i++) {
      data.push(moyenneFinale * (i / steps));
    }
    return data;
  }
}