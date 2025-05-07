import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoinService } from '../../../../../../services/investments/coin/coin.service';
import { Chart, registerables, ChartConfiguration, ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
Chart.register(...registerables);
import { CurrencyPipe, UpperCasePipe } from '@angular/common';

interface CreateOrderRequest {
  coinId: string;
  quantity: number;
  orderType: 'BUY' | 'SELL';
}

interface Order {
  id: number;
  quantity: number;
  orderType: string;
  status: string;
  createdAt: Date;
  // ... autres propriétés
}

@Component({
  selector: 'app-coin-detail',
  templateUrl: './coin-detail.component.html',
  styleUrls: ['./coin-detail.component.css'],
  imports: [CommonModule, SidebarComponent, HeaderComponent, FormsModule],
  providers: [CurrencyPipe, UpperCasePipe],
  standalone: true
})
export class CoinDetailComponent implements OnInit {
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
  
  // Coin details properties
  coinId: string | null = null;
  coinDetails: any;
  chartData: ChartData<'line'> | null = null;
  chart: Chart<'line'> | null = null;
  isLoadingDetails = false;
  errorDetailsMessage = '';
  isLoadingChart = false;
  chartErrorMessage: string | null = null;
  chartDays = 30;
  coinName: string = '';
  
  // Trade popup properties
  isVisible: boolean = false;
  quantity: number | null = null;
  orderType: 'BUY' | 'SELL' = 'BUY';
  errorMessage: string = '';
  isProcessing: boolean = false;
  successMessage: string = '';
  coinImage: string = '';
  coinSymbol: string = '';
  currentPrice: number = 0;
  priceChangePercentage: number = 0;
  walletBalance: number | null = null;
  
  authToken: string | null = localStorage.getItem('auth_token');

  constructor(
    private route: ActivatedRoute,
    private coinService: CoinService,
    private currencyPipe: CurrencyPipe,
    private upperCasePipe: UpperCasePipe,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.coinId = params['coinId'];
      if (this.coinId) {
        this.loadCoinDetails(this.coinId);
      }
    });
    
    // Optional: Load wallet balance if you have an API for it
    this.loadWalletBalance();
  }

  loadCoinDetails(coinId: string): void {
    this.isLoadingDetails = true;
    this.errorDetailsMessage = '';
    this.coinService.getCoinDetails(coinId).subscribe(
      (data: any) => {
        this.coinDetails = data;
        this.coinName = data?.name || '';
        this.coinSymbol = data?.symbol?.toUpperCase() || '';
        this.coinImage = data?.image?.large || '';
        this.currentPrice = data?.market_data?.current_price?.usd || 0;
        this.priceChangePercentage = data?.market_data?.price_change_percentage_24h || 0;
        this.loadChartData(this.coinId!, this.coinName, this.chartDays);
        this.isLoadingDetails = false;
      },
      (error) => {
        this.errorDetailsMessage = 'Failed to load coin details.';
        this.isLoadingDetails = false;
        console.error(error);
      }
    );
  }

  changeChartDays(days: number): void {
    this.chartDays = days;
    if (this.coinId && this.coinName) {
      this.loadChartData(this.coinId, this.coinName, days);
    }
  }

  loadChartData(coinId: string, coinName: string, days: number): void {
    this.isLoadingChart = true;
    this.chartErrorMessage = '';

    this.http.get<any>(`http://localhost:8090/coins/${coinId}/chart?days=${days}`).subscribe({
      next: (response: any) => {
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
      error: (error: any) => {
        this.isLoadingChart = false;
        this.chartErrorMessage = 'Error loading chart data: ' + error.message;
      }
    });
  }

  renderChart(): void {
    if (this.chartData && this.coinId) {
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

      const chartElement = document.getElementById(`coinChart_${this.coinId}`) as HTMLCanvasElement;
      if (chartElement) {
        this.chart = new Chart(
          chartElement,
          chartConfig
        );
      }
    }
  }
  
  // Trade popup methods
  openTradePopup(): void {
    this.isVisible = true;
    this.quantity = null;
    this.orderType = 'BUY';
    this.errorMessage = '';
    this.successMessage = '';
  }

  close(): void {
    this.isVisible = false;
  }
  
  setOrderType(type: 'BUY' | 'SELL'): void {
    this.orderType = type;
  }
  
  isValid(): boolean {
    return this.quantity !== null && this.quantity > 0;
  }
  
  getTotalAmount(): number {
    if (this.quantity === null) return 0;
    return this.quantity * this.currentPrice;
  }
  
  loadWalletBalance(): void {
    // This is a placeholder. You should implement the actual API call
    // to get the user's wallet balance if your backend provides it
    if (this.authToken) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.authToken}`
      });
      
      // Example API call - replace with your actual endpoint
      
      this.http.post<any>('http://localhost:8090/order/pay', { headers })
        .subscribe({
          next: (response) => {
            this.walletBalance = response.balance;
          },
          error: (error) => {
            console.error('Error loading wallet balance:', error);
            // Don't set error message visibly since this is background loading
          }
        });
      
      
      // For now, just set a mock value
      this.walletBalance = 10000;
    }
  }

  confirmTrade(): void {
    if (this.quantity === null || this.quantity <= 0) {
      this.errorMessage = 'Please enter a valid quantity.';
      return;
    }

    this.isProcessing = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.authToken) {
      this.errorMessage = 'Authentication token not found. Please log in again.';
      this.isProcessing = false;
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });

    const body: CreateOrderRequest = {
      coinId: this.coinId!,
      quantity: this.quantity,
      orderType: this.orderType
    };

    this.http.post<Order>('http://localhost:8090/order/pay', body, { headers })
      .subscribe({
        next: (response) => {
          this.successMessage = `Order placed successfully! Order ID: ${response.id}`;
          this.isProcessing = false;
          // Optionally refresh wallet balance
          this.loadWalletBalance();
        },
        error: (error) => {
          this.errorMessage = 'Failed to place order.';
          this.isProcessing = false;
          console.error('Error placing order:', error);
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          }
        }
      });
  }
}