import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recharge-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="recharge-form-container">
      <h3>Recharge Account</h3>

      <div class="form-group">
        <label for="simCardId">Sim Card ID:</label>
        <input type="number" id="simCardId" [(ngModel)]="simCardId" placeholder="Enter Sim Card ID">
      </div>

      <div class="form-group">
        <label for="rechargeCode">Recharge Code:</label>
        <input type="text" id="rechargeCode" [(ngModel)]="rechargeCode" placeholder="Enter Recharge Code">
      </div>

      <button (click)="rechargeClicked()" [disabled]="isLoading">
        <span *ngIf="!isLoading">Recharge</span>
        <span *ngIf="isLoading">Recharging...</span>
      </button>

      <div *ngIf="errorMessage" class="error-message">
        Error: {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .recharge-form-container {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border: 1px solid var(--border);
      border-radius: 0.75rem;
      background-color: white;
    }

    h3 {
      color: var(--primary-dark);
      margin-bottom: 1rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .form-group input[type="number"],
    .form-group input[type="text"] {
      width: 100%;
      padding: 0.7rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      box-sizing: border-box;
      color: var(--text-primary);
    }

    button {
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.8rem 1.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s ease;
    }

    button:hover {
      background-color: var(--primary-dark);
    }

    button:disabled {
      background-color: var(--border);
      cursor: not-allowed;
    }

    .error-message {
      color: var(--negative);
      margin-top: 1rem;
      font-size: 0.9rem;
    }
  `]
})
export class RechargeFormComponent {
  simCardId: number | null = null;
  rechargeCode: string = '';
  @Input() isLoading: boolean = false; // Add @Input()
  @Input() errorMessage: string = ''; // Add @Input()

  @Output() recharge = new EventEmitter<{ simCardId: number | null, rechargeCode: string }>();

  rechargeClicked(): void {
    if (this.simCardId && this.rechargeCode) {
      this.isLoading = true;
      this.errorMessage = '';
      this.recharge.emit({ simCardId: this.simCardId, rechargeCode: this.rechargeCode });
    } else {
      this.errorMessage = 'Please enter Sim Card ID and Recharge Code.';
    }
  }

  setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  setErrorMessage(message: string): void {
    this.errorMessage = message;
  }
}
