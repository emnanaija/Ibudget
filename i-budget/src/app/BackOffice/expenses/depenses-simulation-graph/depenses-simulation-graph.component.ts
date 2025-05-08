import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DepenseReccurenteService } from '../../../services/depenses-reccurentes/depenses-reccurentes.service';
import { FormsModule } from '@angular/forms';

Chart.register(...registerables); // sans zoom pour éviter le SSR crash

@Component({
  selector: 'app-depenses-simulation',
  standalone: true,
  templateUrl: './depenses-simulation-graph.component.html',
  styleUrls: ['./depenses-simulation-graph.component.css'],
  imports: [CommonModule, FormsModule]
})
export class DepensesSimulationComponent implements OnInit {
  simulationData: any;
  chartInstance: any;

  categoryLabels: { [key: string]: string } = {
    'Alimentation': 'Alimentation & Épicerie',
    'Carburant': 'Carburant & Transport',
    'sportttttfv': 'Sports & Activités',
    'other': 'Autres Dépenses',
  };

  constructor(private depensesSimulationService: DepenseReccurenteService) {}

  async ngOnInit(): Promise<void> {
    // Import dynamique de zoom uniquement si `window` existe
    if (typeof window !== 'undefined') {
      const zoomPlugin = (await import('chartjs-plugin-zoom')).default;
      Chart.register(zoomPlugin);
    }

    this.getSimulationData();
  }

  getSimulationData() {
    this.depensesSimulationService.simulerDepensesParCategorie().subscribe(
      (data) => {
        this.simulationData = data;
        this.createChart();
      },
      (error) => {
        console.error('Erreur lors de la récupération des données de simulation', error);
      }
    );
  }

  createChart() {
    if (!this.simulationData) return;

    const labels = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const datasets = Object.entries(this.simulationData).map(([category, monthlyData]: [string, any]) => ({
      label: category,
      data: Array.from({ length: 12 }, (_, i) => Number((monthlyData[i + 1] || 0).toFixed(2))),
      borderColor: this.getCategoryColor(category),
      backgroundColor: this.getCategoryColor(category, 0.3),
      fill: true,
      tension: 0.4,
      borderWidth: 2
    }));

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart('depensesChart', {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        plugins: {
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
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              label: (context: any) => `${context.dataset.label}: ${context.raw?.toFixed(2) || '0.00'} TND`
            }
          },
          zoom: {
            pan: { enabled: true, mode: 'xy' },
            zoom: {
              wheel: { enabled: true },
              pinch: { enabled: true },
              mode: 'xy'
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#fff' },
            title: {
              display: true,
              text: 'Mois',
              color: '#fff',
              font: { size: 14, weight: 'bold' }
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: '#fff',
              callback: value => value + ' TND'
            },
            title: {
              display: true,
              text: 'Dépense (TND)',
              color: '#fff',
              font: { size: 14, weight: 'bold' }
            }
          }
        }
      }
    });
  }

  getCategoryColor(category: string, alpha = 1): string {
    const colors: { [key: string]: string } = {
      'Alimentation': 'rgba(255, 99, 132',
      'Carburant': 'rgba(54, 162, 235',
      'sportttttfv': 'rgba(75, 192, 192',
      'other': 'rgba(255, 206, 86',
      'Loisirs': 'rgba(153, 102, 255',
      'Transport': 'rgba(255, 159, 64',
      'Logement': 'rgba(199, 199, 199',
      'Santé': 'rgba(83, 230, 157',
    };

    if (!colors[category]) {
      let hash = 0;
      for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
      }
      const r = Math.abs(hash % 255);
      const g = Math.abs((hash * 7) % 255);
      const b = Math.abs((hash * 13) % 255);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    return `${colors[category]}, ${alpha})`;
  }


  resetZoom() {
    if (this.chartInstance && this.chartInstance.resetZoom) {
      this.chartInstance.resetZoom();
    }
  }
  
}
