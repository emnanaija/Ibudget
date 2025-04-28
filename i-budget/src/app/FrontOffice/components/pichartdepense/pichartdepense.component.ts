import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { DepenseReccurenteService } from '../../services/depenses-reccurentes/depenses-reccurentes.service';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-pichartdepense',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './pichartdepense.component.html',
  styleUrls: ['./pichartdepense.component.css']
})
export class PichartdepenseComponent implements OnInit, AfterViewInit {
  @ViewChild('pieChart', { static: false }) pieChart: ElementRef<HTMLCanvasElement> | undefined;
  depensesParCategorie: any[] = [];
  chart: any;
  private chartInitialized = false;
  private isBrowser: boolean;

  constructor(
    private depenseReccurenteService: DepenseReccurenteService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    this.depenseReccurenteService.getDepenseTotalesParCategorie()
      .subscribe({
        next: (data) => {
          this.depensesParCategorie = data;
          console.log('Données récupérées :', this.depensesParCategorie);
          if (this.chartInitialized && this.isBrowser) {
            this.updateChart();
          }
        },
        error: (error) => {
          console.error('Erreur lors du chargement des données:', error);
        }
      });
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initializeChart();
      }, 100);
    }
  }

  private initializeChart() {
    try {
      if (!this.pieChart?.nativeElement) {
        console.error('Canvas element not found');
        return;
      }

      const canvas = this.pieChart.nativeElement;
      if (!canvas) {
        console.error('Canvas is null');
        return;
      }

      if (canvas.width === 0 || canvas.height === 0) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Could not get 2D context');
        return;
      }

      this.createChart(ctx);
      this.chartInitialized = true;
    } catch (error) {
      console.error('Error initializing chart:', error);
    }
  }

  private createChart(ctx: CanvasRenderingContext2D): void {
    try {
      // Fonction pour créer un dégradé avec typage correct
      const createGradient = (context: CanvasRenderingContext2D, colorStart: string, colorEnd: string): CanvasGradient => {
        const gradient = context.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
      };
  
      const chartData = this.depensesParCategorie.map(depense => depense.montantTotal);
      const chartLabels = this.depensesParCategorie.map(depense => depense.categorie);
      
      const totalMontant = chartData.reduce((acc, value) => acc + value, 0);
      const chartPercentages = chartData.map(data => (data / totalMontant) * 100);
      
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: chartLabels,
          datasets: [{
            data: chartData,
            backgroundColor: [
              createGradient(ctx, '#8A2BE2', '#6A5ACD'), // Dégradé violet bleuâtre
              createGradient(ctx, '#E100FF', '#9932CC'), // Dégradé magenta
              createGradient(ctx, '#43CBFF', '#3F7AD3'), // Dégradé bleu
              createGradient(ctx, '#B666D2', '#9370DB'), // Dégradé mauve
              createGradient(ctx, '#FF6AD5', '#C71585'), // Dégradé rose
              createGradient(ctx, '#5D3FD3', '#483D8B'), // Dégradé violet royal
              createGradient(ctx, '#36E2BD', '#12A182'), // Dégradé turquoise
              createGradient(ctx, '#D25B5B', '#8B0000'), // Dégradé rouge
              createGradient(ctx, '#FFA500', '#FF8C00'), // Dégradé orange
              createGradient(ctx, '#FFD700', '#DAA520'), // Dégradé or
            ],
            borderColor: 'rgba(30, 30, 50, 0.8)',
            borderWidth: 2,
            hoverBorderColor: 'rgba(255, 255, 255, 0.2)',
            hoverBorderWidth: 3,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            animateScale: true,
            animateRotate: true,
            duration: 1500,
            easing: 'easeOutQuart'
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const dataset = tooltipItem.dataset;
                  const value = dataset.data[tooltipItem.dataIndex];
                  const percentage = chartPercentages[tooltipItem.dataIndex].toFixed(2);
                  return `${tooltipItem.label}: ${value} (${percentage}%)`;
                }
              },
              backgroundColor: 'rgba(20, 20, 40, 0.95)',
              titleColor: '#ffffff',
              bodyColor: '#e2e8f0',
              borderColor: 'rgba(138, 43, 226, 0.3)',
              borderWidth: 1,
              padding: 12,
              bodyFont: {
                family: "'Segoe UI', system-ui, -apple-system, sans-serif",
                size: 14
              },
              titleFont: {
                family: "'Segoe UI', system-ui, -apple-system, sans-serif",
                size: 14,
                weight: 'bold'
              },
              displayColors: true,
              boxPadding: 5
            },
            legend: {
              position: 'top',
              labels: {
                color: '#d1d1d1',
                font: {
                  family: "'Segoe UI', system-ui, -apple-system, sans-serif",
                  size: 12
                },
                padding: 15,
                boxWidth: 12,
                boxHeight: 12,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
          }
        }
      });
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  private updateChart() {
    if (!this.chart) return;

    try {
      const chartData = this.depensesParCategorie.map(depense => depense.montantTotal);
      const chartLabels = this.depensesParCategorie.map(depense => depense.categorie);

      this.chart.data.labels = chartLabels;
      this.chart.data.datasets[0].data = chartData;
      this.chart.update();
    } catch (error) {
      console.error('Error updating chart:', error);
    }
  }
}
