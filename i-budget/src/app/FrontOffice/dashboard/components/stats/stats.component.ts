import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements AfterViewInit {
  @ViewChild('lineChart') lineChartRef!: ElementRef;
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  @ViewChild('barChart') barChartRef!: ElementRef;

  ngAfterViewInit() {
    this.createLineChart();
    this.createPieChart();
    this.createBarChart();
  }

  createLineChart() {
    const ctx = this.lineChartRef.nativeElement.getContext('2d');

    const chart = new Chart(ctx, {
      type: 'line' as const,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'New Users',
          data: [650, 890, 1200, 980, 1400, 1700],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.4,
          pointBackgroundColor: 'white',
          pointBorderColor: 'rgba(75, 192, 192, 1)',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  createPieChart() {
    const ctx = this.pieChartRef.nativeElement.getContext('2d');

    const chart = new Chart(ctx, {
      type: 'doughnut' as const,
      data: {
        labels: ['Mobile', 'Desktop', 'Tablet'],
        datasets: [{
          data: [65, 25, 10],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)'
          ],
          borderColor: 'white',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom' as const,
            labels: {
              boxWidth: 12,
              padding: 15
            }
          }
        },
        elements: {
          arc: {
            cutout: '65%'
          }
        }
      } as any // You might still need this outer 'as any' depending on your Chart.js version
    });
  }

  createBarChart() {
    const ctx = this.barChartRef.nativeElement.getContext('2d');

    const chart = new Chart(ctx, {
      type: 'bar' as const,
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Engagement',
            data: [65, 59, 80, 81, 56, 73],
            backgroundColor: 'rgba(54, 162, 235, 0.8)'
          },
          {
            label: 'Retention',
            data: [45, 49, 60, 71, 46, 63],
            backgroundColor: 'rgba(75, 192, 192, 0.8)'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              boxWidth: 12,
              padding: 15
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        elements: {
          bar: {
            barPercentage: 0.7
          }
        }
      } as any // You might still need this outer 'as any' depending on the exact Chart.js version
    });
  }
}
