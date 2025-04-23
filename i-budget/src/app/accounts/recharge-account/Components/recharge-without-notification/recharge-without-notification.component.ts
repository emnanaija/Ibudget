import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {SimCardAccount} from '../../../../services/account.service';

@Component({
  selector: 'app-recharge-without-notification',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="recharge-no-notify-container">
      <h3>Recharge Account Without Notification</h3>

      <div class="form-group">
        <label for="simCardIdNoNotify">Sim Card ID:</label>
        <input type="number" id="simCardIdNoNotify" [(ngModel)]="simCardIdNoNotify" placeholder="Enter Sim Card ID">
      </div>

      <div class="form-group">
        <label for="rechargeCodeNoNotify">Recharge Code:</label>
        <input type="text" id="rechargeCodeNoNotify" [(ngModel)]="rechargeCodeNoNotify" placeholder="Enter Recharge Code">
      </div>

      <button (click)="rechargeClicked()" [disabled]="isLoading">
        <span *ngIf="!isLoading">Recharge (No Notify)</span>
        <span *ngIf="isLoading">Recharging...</span>
      </button>

      <div *ngIf="rechargeResult" class="recharge-notification-container">
        <h4>Recharge Successful!</h4>
        <div class="bank-card">
          <div class="card-header">
            <span>My Account</span>
          </div>
          <div class="card-body">
            <div class="balance">
              <span class="label">Balance:</span>
              <span class="amount">{{ previousBalance }} <span class="currency">TND</span></span>
            </div>
            <div class="recharge-animation" *ngIf="isAnimatingRecharge">
              <span class="plus">+</span> <span class="recharge-amount">{{ rechargeAmount }}</span> <span class="currency">TND</span>
            </div>
            <div class="new-balance">
              <span class="label">New Balance:</span>
              <span class="amount">{{ rechargeResult.balance }} <span class="currency">TND</span></span>
            </div>
          </div>
          <div class="card-footer">
            <span>Sim Card ID: {{ rechargeResult.simCardId }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        Error: {{ errorMessage }}
      </div>
    </div>
  `,
  styles: [`
    .recharge-no-notify-container {
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
      background-color: var(--info);
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.8rem 1.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s ease;
    }

    button:hover {
      background-color: var(--info-dark);
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

    .recharge-notification-container {
      margin-top: 1.5rem;
      text-align: center;
    }

    .bank-card {
      background: linear-gradient(135deg, var(--primary-light), var(--primary));
      color: white;
      border-radius: 1rem;
      box-shadow: 0 8px 20px rgba(var(--primary-rgb), 0.3);
      padding: 1.5rem;
      margin: 1rem auto;
      max-width: 300px;
      font-family: 'Arial', sans-serif;
    }

    .bank-card .card-header {
      text-align: center;
      margin-bottom: 1rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: white;
    }

    .bank-card .card-body {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      align-items: center;
    }

    .bank-card .balance,
    .bank-card .new-balance {
      font-size: 1rem;
      color: white;
    }

    .bank-card .balance .amount,
    .bank-card .new-balance .amount {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
    }

    .bank-card .currency {
      font-size: 0.8rem;
      margin-left: 0.2rem;
      color: white;
    }

    .recharge-animation {
      font-size: 1.2rem;
      font-weight: bold;
      color: var(--positive-light);
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease-out, transform 0.5s ease-out;
    }

    .recharge-animation.ng-star-inserted {
      opacity: 1;
      transform: translateY(0);
    }

    .recharge-animation .plus {
      color: var(--positive-light);
      margin-right: 0.3rem;
    }

    .bank-card .card-footer {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
    }
  `]
})
export class RechargeWithoutNotificationComponent {
  simCardIdNoNotify: number | null = null;
  rechargeCodeNoNotify: string = '';
  @Input() isLoading: boolean = false; // Add @Input()
  @Input() errorMessage: string = ''; // Add @Input()
  @Input() previousBalance: number = 0; // Add @Input()
  @Input() rechargeResult: SimCardAccount | null = null; // Add @Input()
  @Output() rechargeWithoutNotification = new EventEmitter<{ simCardId: number | null, rechargeCode: string }>();
  isAnimatingRecharge: boolean = false; // Declare this property
  rechargeAmount: number = 0; // Declare this property
  rechargeClicked(): void {
    if (this.simCardIdNoNotify && this.rechargeCodeNoNotify) {
      this.isLoading = true;
      this.errorMessage = '';
      this.rechargeWithoutNotification.emit({ simCardId: this.simCardIdNoNotify, rechargeCode: this.rechargeCodeNoNotify });
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

  setRechargeResult(result: SimCardAccount | null): void {
    this.rechargeResult = result;
    if (result) {
      this.isAnimatingRecharge = true;
      this.rechargeAmount = result.balance - this.previousBalance;
      // Optionally, reset animation after a delay
      // setTimeout(() => this.isAnimatingRecharge = false, 2000);
    } else {
      this.isAnimatingRecharge = false;
      this.rechargeAmount = 0;
    }
  }

  setPreviousBalance(balance: number): void {
    this.previousBalance = balance;
  }
}
