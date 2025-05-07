import { Component, OnInit } from '@angular/core';
import { CoinService } from '../../../../../../services/investments/coin/coin.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { HttpClient } from '@angular/common/http';
import { Chart, ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';

@Component({
  selector: 'app-coin-list',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './coin-list.component.html',
  styleUrls: ['./coin-list.component.css']
})
export class CoinListComponent implements OnInit {
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  allCoins: any[] = [];
  coins: any[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  page = 1;
  selectedCoinId: string | null = null;
  selectedCoinName: string | null = null;
  chartData: ChartData<'line'> | null = null;
  chart: Chart<'line'> | null = null;
  showChartPopup = false;
  chartDays: number = 30;
  isLoadingChart: boolean = false;
  chartErrorMessage: string | null = null;
  isSearching = false;

  constructor(private coinService: CoinService, private http: HttpClient) { }

  ngOnInit() {
    this.loadCoins();
  }

  loadCoins() {
    this.isLoading = true;
    this.errorMessage = null;
    this.isSearching = false;

    this.coinService.getCoinList(this.page).subscribe({
      next: (data) => {
        this.allCoins = data;
        this.coins = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMessage = 'Failed to load coins. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  loadNextPage() {
    this.page++;
    this.loadCoins();
  }

  loadPreviousPage() {
    if (this.page > 1) {
      this.page--;
      this.loadCoins();
    }
  }

  openChartPopup(coinId: string, coinName: string): void {
    this.selectedCoinId = coinId;
    this.selectedCoinName = coinName;
    this.showChartPopup = true;
    this.chartDays = 30;
    this.loadChartData(coinId, coinName, this.chartDays);
  }

  closeChartPopup(): void {
    this.showChartPopup = false;
    this.chartData = null;
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    this.selectedCoinId = null;
    this.chartErrorMessage = null;
    if (this.isSearching) {
      this.coins = this.allCoins;
      this.isSearching = false;
    }
  }

  changeChartDays(days: number): void {
    this.chartDays = days;
    if (this.selectedCoinId && this.selectedCoinName) {
      this.loadChartData(this.selectedCoinId, this.selectedCoinName, this.chartDays);
    }
  }

  loadChartData(coinId: string, coinName: string, days: number): void {
    this.isLoadingChart = true;
    this.chartErrorMessage = '';

    this.http.get<any>(`http://localhost:8090/coins/${coinId}/chart?days=${days}`).subscribe({
      next: (response) => {
        this.isLoadingChart = false;
        if (response && response.prices) {
          const prices = response.prices;
          const labels = prices.map((price: [number, number]) => new Date(price[0]).toLocaleDateString());
          const data = prices.map((price: [number, number]) => price[1]);

          this.chartData = {
            labels: labels,
            datasets: [
              {
                data: data,
                label: `Price (${coinName})`,
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1
              }
            ]
          };
          this.renderChart();
        } else {
          this.chartErrorMessage = 'Failed to load chart data.';
        }
      },
      error: (error) => {
        this.isLoadingChart = false;
        this.chartErrorMessage = 'Error loading chart data: ' + error.message;
      }
    });
  }

  renderChart(): void {
    if (this.chartData && this.selectedCoinId) {
      if (this.chart) {
        this.chart.destroy();
      }
      const chartConfig: ChartConfiguration<'line'> = {
        type: 'line',
        data: this.chartData,
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Price (USD)'
              }
            }
          }
        }
      };

      const chartElement = document.getElementById(`coinChart_${this.selectedCoinId}`) as HTMLCanvasElement;
      if (chartElement) {
        this.chart = new Chart(
          chartElement,
          chartConfig
        );
      }
    }
  }

  handleSearchResults(results: any): void {
    this.coins = results; // Assign the array of search results directly
    this.isSearching = true;
    this.errorMessage = null;
    this.isLoading = false;
    this.page = 1;
  }
}