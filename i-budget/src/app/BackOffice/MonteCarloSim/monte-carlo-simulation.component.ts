import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { Chart, registerables } from 'chart.js';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiLoadingComponent } from '../../shared/components/ai-loading/ai-loading.component';

Chart.register(...registerables);

@Component({
  selector: 'app-monte-carlo-simulation',
  standalone: true,
  imports: [NgIf, FormsModule, AiLoadingComponent],
  templateUrl: './monte-carlo-simulation.component.html',
  styleUrls: ['./monte-carlo-simulation.component.css']
})
export class MonteCarloSimulationComponent implements OnInit, AfterViewInit {
  @Input() simCardId: number | undefined;
  totalBudget: number | null = null;
  predictionError: string | null = null;
  optimizationError: string | null = null;
  optimizationResult: number | null = null;
  numFutureMonths: number = 6; // Default value for future months prediction

  // New properties for handling response
  rawAiResponse: any = null;
  forecastMessage: string | null = null;
  forecastedVolumes: number[] | null = null;
  chart: Chart | null = null;

  // Loading state properties
  isLoading: boolean = false;
  loadingStep: number = 0;
  loadingInterval: any = null;
  loadingSteps: string[] = [
    'Analyzing transaction patterns',
    'Running Monte Carlo simulations',
    'Generating financial insights',
    'Preparing visualization'
  ];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    // Initialization logic if needed
  }

  ngAfterViewInit(): void {
    // Initialize chart if data already exists
    if (this.forecastedVolumes && this.forecastedVolumes.length > 0) {
      setTimeout(() => this.renderPredictionChart(), 100);
    }
  }

  predictVolumes(): void {
    if (this.simCardId) {
      // Start loading animation
      this.startLoading();

      this.accountService
        .predictTransactionVolumes(this.simCardId, this.numFutureMonths)
        .subscribe({
          next: (data) => {
            console.log('Received data:', data);
            this.predictionError = null;
            this.rawAiResponse = data;
            this.processResponse(data);
            // Stop loading animation after a minimum time for better UX
            setTimeout(() => this.stopLoading(), 1000);
          },
          error: (error) => {
            this.rawAiResponse = null;
            this.predictionError =
              error.message || 'Could not predict transaction volumes.';
            console.error('Prediction error:', error);
            this.stopLoading();
          },
        });
    }
  }

  optimizeBudget(): void {
    if (this.simCardId && this.totalBudget !== null) {
      // Start loading animation
      this.startLoading();

      this.accountService
        .optimizeBudget(this.simCardId, this.totalBudget)
        .subscribe({
          next: (data) => {
            this.optimizationResult = data;
            this.optimizationError = null;
            // Stop loading animation after a minimum time for better UX
            setTimeout(() => this.stopLoading(), 1000);
          },
          error: (error) => {
            this.optimizationResult = null;
            this.optimizationError =
              error.message || 'Could not optimize budget.';
            console.error('Optimization error:', error);
            this.stopLoading();
          },
        });
    } else {
      this.optimizationError =
        'Please select a user and enter a total budget.';
    }
  }

  startLoading(): void {
    this.isLoading = true;
    this.loadingStep = 0;

    // Simulate progress through loading steps
    this.loadingInterval = setInterval(() => {
      if (this.loadingStep < this.loadingSteps.length) {
        this.loadingStep++;
      } else {
        clearInterval(this.loadingInterval);
      }
    }, 800);
  }

  stopLoading(): void {
    // Ensure all steps are shown as complete
    this.loadingStep = this.loadingSteps.length;

    // Clear the interval if it's still running
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
    }

    // Delay hiding the loading screen slightly for a smooth transition
    setTimeout(() => {
      this.isLoading = false;

      // Make sure to render the chart after loading is complete
      if (this.forecastedVolumes && this.forecastedVolumes.length > 0) {
        setTimeout(() => this.renderPredictionChart(), 200);
      }
    }, 500);
  }

  processResponse(response: any): void {
    try {
      console.log('Processing response:', response);

      // Direct extraction from the response format
      if (response) {
        // Extract the forecast message (ignoring error messages)
        this.forecastMessage = response.forecastMessage || null;

        // Extract the forecasted volumes array
        if (response.forecastedVolumes && Array.isArray(response.forecastedVolumes)) {
          this.forecastedVolumes = response.forecastedVolumes;
          console.log('Extracted volumes:', this.forecastedVolumes);
        } else {
          console.warn('No valid forecasted volumes found in response');
        }
      } else {
        console.error('Invalid response format');
      }
    } catch (error) {
      console.error('Error processing response:', error);
      this.predictionError = 'Error processing response: ' + error;
    }
  }

  formatAiResponse(text: string): string {
    if (!text) return '';

    // Replace newlines with <br> tags
    let formattedText = text.replace(/\n/g, '<br>');

    // Add styling for emojis
    formattedText = formattedText.replace(/([\u{1F300}-\u{1F6FF}])/gu,
      '<span class="emoji">$1</span>');

    return formattedText;
  }

  renderPredictionChart(): void {
    if (!this.forecastedVolumes || this.forecastedVolumes.length === 0) {
      console.error('No data available for chart rendering');
      return;
    }

    const chartCanvas = document.getElementById('predictionChart');
    if (!chartCanvas) {
      console.error('Chart canvas element not found');
      return;
    }

    console.log('Rendering chart with data:', this.forecastedVolumes);

    // Destroy previous chart instance if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Get the canvas context
    const ctx = (chartCanvas as HTMLCanvasElement).getContext('2d');
    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    // Create the chart
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from(
          { length: this.forecastedVolumes.length },
          (_, i) => `Month ${i + 1}`
        ),
        datasets: [
          {
            label: 'Predicted Transaction Volume',
            data: this.forecastedVolumes,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: 'rgba(99, 102, 241, 1)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#f1f5f9'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: 'rgba(99, 102, 241, 0.5)',
            borderWidth: 1,
            displayColors: false,
            padding: 10
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            },
            title: {
              display: true,
              text: 'Transaction Volume',
              color: '#f1f5f9'
            },
          },
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            },
            title: {
              display: true,
              text: 'Month',
              color: '#f1f5f9'
            },
          },
        },
      },
    });
  }
}
