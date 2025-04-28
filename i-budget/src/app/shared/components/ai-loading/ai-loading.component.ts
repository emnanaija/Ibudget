import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-ai-loading',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="loading-container" *ngIf="isVisible">
      <div class="loading-content">
        <div class="loading-animation">
          <div class="brain-container">
            <div class="brain">
              <div class="brain-path"></div>
              <div class="money-particle">💰</div>
              <div class="money-particle">💵</div>
              <div class="money-particle">📈</div>
              <div class="money-particle">💎</div>
            </div>
          </div>
        </div>
        <div class="loading-text">
          <h3>{{ title }}</h3>
          <p>{{ subtitle }}</p>
          <div class="loading-steps" *ngIf="steps && steps.length > 0">
            <div
              *ngFor="let step of steps; let i = index"
              class="step"
              [class.active]="currentStep >= i + 1"
            >
              {{ step }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 1rem;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0);
      height: 100%; /* Occupy the full height of its parent */
      width: 90%;  /* Occupy the full width of its parent */
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }

    .loading-animation {
      position: relative;
      width: 150px;
      height: 150px;
    }

    .brain-container {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brain {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
      border-radius: 50%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
      animation: pulse 2s infinite;
    }

    .brain-path {
      width: 80px;
      height: 80px;
      border: 2px dashed rgba(99, 102, 241, 0.6);
      border-radius: 50%;
      position: absolute;
      animation: rotate 8s linear infinite;
    }

    .money-particle {
      position: absolute;
      font-size: 1.5rem;
      animation: orbit 4s linear infinite;
      opacity: 0.8;
    }

    .money-particle:nth-child(2) {
      animation-delay: -1s;
    }

    .money-particle:nth-child(3) {
      animation-delay: -2s;
    }

    .money-particle:nth-child(4) {
      animation-delay: -3s;
    }

    .loading-text {
      text-align: center;
    }

    .loading-text h3 {
      margin: 0 0 0.5rem;
      font-size: 1.25rem;
      background: linear-gradient(90deg, #4f46e5, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 700;
    }

    .loading-text p {
      margin: 0 0 1.5rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .loading-steps {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-align: left;
      width: 100%;
    }

    .step {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      background: rgba(0, 0, 0, 0.1);
      color: var(--text-secondary);
      font-size: 0.85rem;
      position: relative;
      padding-left: 2rem;
      transition: all 0.3s ease;
    }

    .step::before {
      content: "⭕";
      position: absolute;
      left: 0.75rem;
      opacity: 0.5;
    }

    .step.active {
      background: rgba(99, 102, 241, 0.1);
      color: var(--text-primary);
    }

    .step.active::before {
      content: "✅";
      opacity: 1;
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
        box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 0 40px rgba(99, 102, 241, 0.5);
      }
      100% {
        transform: scale(1);
        box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
      }
    }

    @keyframes rotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes orbit {
      0% {
        transform: rotate(0deg) translateX(50px) rotate(0deg);
      }
      100% {
        transform: rotate(360deg) translateX(50px) rotate(-360deg);
      }
    }

    @media (max-width: 768px) {
      .loading-container {
        padding: 1.5rem;
      }

      .loading-animation {
        width: 120px;
        height: 120px;
      }

      .brain {
        width: 80px;
        height: 80px;
      }
    }
  `]
})
export class AiLoadingComponent {
  @Input() isVisible: boolean = true;
  @Input() title: string = 'AI Analysis in Progress';
  @Input() subtitle: string = 'Crunching financial data with advanced algorithms...';
  @Input() steps: string[] = [];
  @Input() currentStep: number = 0;
}
