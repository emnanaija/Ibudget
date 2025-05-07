import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header.component';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Chart, ChartOptions, ChartType, ChartData, TooltipItem } from 'chart.js/auto';

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap?: number;
  total_volume?: number;
}
interface Asset {
  id: number;
  coin: Coin;
  quantity: number;
  buyPrice: number;
}

interface AssetDisplay extends Asset {
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

interface PortfolioPerformance {
  monthlyMeanReturn: number;
  monthlyVolatility: number;
}

@Component({
  selector: 'app-investment-portfolio',
  templateUrl: './investment-portfolio.component.html',
  styleUrls: ['./investment-portfolio.component.css'],
  imports: [CommonModule, SidebarComponent, HeaderComponent, FormsModule],
  standalone: true,
})
export class InvestmentPortfolioComponent implements OnInit, AfterViewInit {
  @ViewChild('riskChartCanvas') riskChartCanvas!: ElementRef;
  @ViewChild('performanceChartCanvas') performanceChartCanvas!: ElementRef;
  @ViewChild('riskChartCanvasPopup') riskChartCanvasPopup!: ElementRef;
  riskChart: Chart | null = null;
  riskChartPopup: Chart | null = null;
  performanceChart: Chart | null = null;

  private apiUrl = 'http://localhost:8090/api/asset';
  isSidebarCollapsed = false;
  assets: AssetDisplay[] = [];
  loadingAssets: boolean = true;

  portfolioRisk: number | null = null;
  loadingRisk: boolean = false;
  riskError: string | null = null;
  riskChartData: any;
  riskDaysInput: number = 30;
  readonly optimalRiskThreshold = 95.5;
  portfolioRiskValue: number | null = null;
  isRiskChartPopupVisible: boolean = false;

  portfolioPerformance: PortfolioPerformance | null = null;
  loadingPerformance: boolean = false;
  performanceError: string | null = null;
  performanceChartData: any;
  performanceDaysInput: number = 30;
  portfolioPerformanceData: PortfolioPerformance | null = null;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadAssets();
  }

  ngAfterViewInit(): void {
    if (this.portfolioPerformanceData !== null && this.performanceChartCanvas) {
      this.generatePerformanceChart(this.performanceDaysInput);
    }
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  getAuthHeaders(): HttpHeaders {
    const jwtToken = localStorage.getItem('accessToken');
    if (jwtToken) {
      return new HttpHeaders({
        'Authorization': `Bearer ${jwtToken}`
      });
    }
    return new HttpHeaders();
  }

  loadAssets(): void {
    this.loadingAssets = true;
    this.http.get<Asset[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() }).subscribe(
      (data) => {
        this.assets = data.map(asset => {
          const currentValue = asset.quantity * asset.coin.current_price;
          const profitLoss = currentValue - (asset.quantity * asset.buyPrice);
          const profitLossPercentage = (asset.buyPrice === 0) ? 0 : (profitLoss / (asset.quantity * asset.buyPrice)) * 100;
          return {
            ...asset,
            currentValue: currentValue,
            profitLoss: profitLoss,
            profitLossPercentage: profitLossPercentage,
          };
        });
        this.loadingAssets = false;
      },
      (error) => {
        console.error('Error loading assets', error);
        this.loadingAssets = false;
      }
    );
  }

  loadPortfolioRisk(days: number): void {
    this.loadingRisk = true;
    this.portfolioRisk = null;
    this.riskError = null;
    this.http.get<number>(`${this.apiUrl}/risk?days=${days}`, { headers: this.getAuthHeaders() }).subscribe(
      (risk) => {
        this.portfolioRiskValue = risk;
        this.loadingRisk = false;

        // Generate chart when data is received, don't wait for popup to be visible
        setTimeout(() => {
          if (this.riskChartCanvasPopup) {
            this.generateRiskChartPopup();
          }
        }, 100);
      },
      (error) => {
        console.error('Error retrieving portfolio risk', error);
        this.riskError = "Error calculating risk.";
        this.loadingRisk = false;
      }
    );
  }

  loadPortfolioPerformance(days: number): void {
    this.loadingPerformance = true;
    this.portfolioPerformance = null;
    this.performanceError = null;
    this.http.get<PortfolioPerformance>(`${this.apiUrl}/performance?days=${days}`, { headers: this.getAuthHeaders() }).subscribe(
      (performance) => {
        this.portfolioPerformanceData = performance;
        this.loadingPerformance = false;
        setTimeout(() => {
          if (this.performanceChartCanvas) {
            this.generatePerformanceChart(days);
          }
        }, 100);
      },
      (error) => {
        console.error('Error retrieving portfolio performance', error);
        this.performanceError = "Error calculating performance.";
        this.loadingPerformance = false;
      }
    );
  }

  showRiskChart(): void {
    this.isRiskChartPopupVisible = true;

    // Use setTimeout to ensure the canvas is rendered before accessing it
    setTimeout(() => {
      this.generateRiskChartPopup();
    }, 100);
  }

  generateRiskChartPopup(): void {
    console.log('generateRiskChartPopup called');
    if (!this.riskChartCanvasPopup) {
      console.error('Risk chart popup canvas is null.');
      return;
    }

    const ctx = this.riskChartCanvasPopup.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Unable to get 2D context for risk chart popup canvas.');
      return;
    }

    // Destroy previous chart if it exists
    if (this.riskChartPopup) {
      this.riskChartPopup.destroy();
    }

    const riskValue = this.portfolioRiskValue || 0;
    const optimalRisk = this.optimalRiskThreshold;

    const chartData: ChartData<'doughnut'> = {
      labels: ['Current Risk', 'Optimal (Reference)'],
      datasets: [{
        data: [riskValue, optimalRisk],
        backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)'],
        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)'],
        borderWidth: 1,
        hoverOffset: 4
      }]
    };

    const chartOptions: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#ecf0f1',
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: `Current Risk vs. Optimal (${this.optimalRiskThreshold}%)`,
          color: '#f39c12',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(52, 73, 94, 0.95)',
          titleColor: '#f39c12',
          titleFont: {
            size: 16,
            weight: 'bold'
          },
          bodyColor: '#ecf0f1',
          bodyFont: {
            size: 14
          },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: (context: TooltipItem<'doughnut'>) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value.toFixed(2)}%`;
            }
          }
        }
      }
    };

    console.log('Creating risk chart with data:', chartData);

    this.riskChartPopup = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: chartOptions
    });
  }

  generatePerformanceChart(days: number): void {
    console.log('generatePerformanceChart called with canvas:', this.performanceChartCanvas);
    if (!this.performanceChartCanvas) return;
    const ctx = this.performanceChartCanvas.nativeElement.getContext('2d');
    if (!ctx || !this.portfolioPerformanceData) return;

    // Destroy previous chart if it exists
    if (this.performanceChart) {
      this.performanceChart.destroy();
    }

    const labels = Array.from({ length: days }, (_, i) => `Day ${i + 1}`);
    const data = labels.map(() => {
      const baseValue = 100;
      const randomFluctuation = (Math.random() - 0.5) * 5;
      return baseValue + (Math.random() * days * 0.2) + randomFluctuation;
    });

    const chartData: ChartData<'line'> = {
      labels: labels,
      datasets: [{
        label: 'Portfolio Value (Simulated)',
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverRadius: 5,
        fill: true
      }]
    };

    const chartOptions: ChartOptions<'line'> = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: '#ecf0f1',
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y: {
          ticks: {
            color: '#ecf0f1',
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: '#ecf0f1',
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: `Portfolio Performance over ${days} Days (Simulated)`,
          color: '#f39c12',
          font: {
            size: 18,
            weight: 'bold'
          },
          padding: {
            top: 10,
            bottom: 20
          }
        },
        tooltip: {
          backgroundColor: 'rgba(52, 73, 94, 0.95)',
          titleColor: '#f39c12',
          titleFont: {
            size: 16,
            weight: 'bold'
          },
          bodyColor: '#ecf0f1',
          bodyFont: {
            size: 14
          },
          padding: 12,
          cornerRadius: 8
        }
      }
    };

    console.log('Performance chart data:', chartData);
    console.log('Performance chart options:', chartOptions);

    this.performanceChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });
  }
}
