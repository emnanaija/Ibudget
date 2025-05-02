import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {SimCardAccount} from '../../../../../services/account.service';

@Component({
  selector: 'app-recharge-without-notification',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="recharge-no-notify-container">
      <h3><i class="fas fa-bell-slash"></i> Recharge Account Without Notification</h3>

      <div class="form-group">
        <label for="simCardIdNoNotify"><i class="fas fa-sim-card"></i> Sim Card ID:</label>
        <div class="input-with-icon">
          <i class="fas fa-id-card input-icon"></i>
          <input type="number" id="simCardIdNoNotify" [(ngModel)]="simCardIdNoNotify" placeholder="Enter Sim Card ID">
        </div>
      </div>

      <div class="form-group">
        <label for="rechargeCodeNoNotify"><i class="fas fa-key"></i> Recharge Code:</label>
        <div class="input-with-icon">
          <i class="fas fa-barcode input-icon"></i>
          <input type="text" id="rechargeCodeNoNotify" [(ngModel)]="rechargeCodeNoNotify" placeholder="Enter Recharge Code">
        </div>
      </div>

      <button (click)="rechargeClicked()" [disabled]="isLoading" class="recharge-button">
        <span *ngIf="!isLoading">
          <i class="fas fa-wallet"></i> Recharge (No Notification)
        </span>
        <span *ngIf="isLoading" class="processing-animation">
          <div class="animation-container">
            <i class="fas fa-wallet wallet-icon"></i>
            <i class="fas fa-arrow-right arrow-icon"></i>
            <i class="fas fa-mobile-alt phone-icon"></i>
            <div class="pulse-circle"></div>
          </div>
          <span class="processing-text">Processing...</span>
        </span>
      </button>

      <div *ngIf="rechargeResult" class="recharge-notification-container">
        <h4><i class="fas fa-check-circle"></i> Recharge Successful!</h4>
        <div class="bank-card">
          <div class="card-header">
            <i class="fas fa-credit-card"></i> <span>My Account</span>
          </div>
          <div class="card-body">
            <div class="balance">
              <span class="label">Balance:</span>
              <span class="amount">{{ previousBalance }} <span class="currency">TND</span></span>
            </div>
            <div class="recharge-animation" *ngIf="isAnimatingRecharge">
              <i class="fas fa-plus-circle"></i> <span class="recharge-amount">{{ rechargeAmount }}</span> <span class="currency">TND</span>
            </div>
            <div class="new-balance">
              <span class="label">New Balance:</span>
              <span class="amount">{{ rechargeResult.balance }} <span class="currency">TND</span></span>
            </div>
          </div>
          <div class="card-footer">
            <i class="fas fa-sim-card"></i> <span>Sim Card ID: {{ rechargeResult.simCardId }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle"></i> Error: {{ errorMessage }}
      </div>

      <div class="notification-info">
        <i class="fas fa-info-circle"></i> This recharge method will not send an SMS notification.
      </div>
    </div>
  `,
  styles: [`
    .recharge-no-notify-container {
      margin-bottom: 2rem;
      padding: 1.5rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, rgba(90, 27, 140, 0.5) 0%, rgba(121, 49, 169, 0.3) 20%, rgba(104, 34, 166, 0.1) 80%);
      backdrop-filter: blur(5px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h3 {
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 1.5rem;
      text-align: center;
      font-weight: 600;
    }

    h3 i {
      margin-right: 0.5rem;
      color: rgba(255, 255, 255, 0.9);
    }

    h4 {
      color: rgba(255, 255, 255, 0.95);
      margin-bottom: 1rem;
      font-weight: 600;
    }

    h4 i {
      margin-right: 0.5rem;
      color: var(--positive);
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 0.5rem;
      font-weight: bold;
      font-size: 0.9rem;
    }

    .form-group label i {
      margin-right: 0.5rem;
      color: rgba(255, 255, 255, 0.95);
    }

    .input-with-icon {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
    }

    .form-group input[type="number"],
    .form-group input[type="text"] {
      width: 100%;
      padding: 0.7rem 0.7rem 0.7rem 2.5rem;
      border: 1px solid var(--border);
      border-radius: 0.5rem;
      box-sizing: border-box;
      color: var(--text-primary);
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .form-group input:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
    }

    .recharge-button {
      width: 100%;
      background-color: var(--info);
      color: white;
      border: none;
      border-radius: 0.5rem;
      padding: 0.9rem 1.5rem;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    .recharge-button:hover {
      background-color: var(--info-dark);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .recharge-button:disabled {
      background-color: var(--border);
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .recharge-button i {
      margin-right: 0.5rem;
    }

    .processing-animation {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .animation-container {
      position: relative;
      height: 40px;
      width: 100%;
      margin-bottom: 8px;
    }

    .wallet-icon {
      position: absolute;
      left: 30%;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.2rem;
      animation: wallet-pulse 2s infinite;
    }

    .arrow-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.2rem;
      animation: arrow-fade 2s infinite;
    }

    .phone-icon {
      position: absolute;
      right: 30%;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.5);
      font-size: 1.2rem;
      animation: phone-fade 2s infinite;
    }

    .pulse-circle {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      animation: pulse 2s infinite;
    }

    .processing-text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.9rem;
    }

    @keyframes wallet-pulse {
      0% { transform: translateY(-50%) scale(1); opacity: 0.7; }
      25% { transform: translateY(-50%) scale(1.2); opacity: 1; }
      50% { transform: translateY(-50%) scale(1); opacity: 0.7; }
      100% { transform: translateY(-50%) scale(1); opacity: 0.7; }
    }

    @keyframes arrow-fade {
      0% { opacity: 0.3; }
      50% { opacity: 1; }
      100% { opacity: 0.3; }
    }

    @keyframes phone-fade {
      0% { opacity: 0.3; }
      100% { opacity: 0.3; }
    }

    @keyframes pulse {
      0% { width: 40px; height: 40px; opacity: 0.5; }
      50% { width: 70px; height: 70px; opacity: 0.2; }
      100% { width: 40px; height: 40px; opacity: 0.5; }
    }

    .error-message {
      color: var(--negative);
      margin-top: 1rem;
      font-size: 0.9rem;
      padding: 0.75rem;
      background-color: rgba(239, 68, 68, 0.1);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
    }

    .error-message i {
      margin-right: 0.5rem;
      color: var(--negative);
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
      position: relative;
      overflow: hidden;
    }

    .bank-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
      pointer-events: none;
    }

    .bank-card .card-header {
      text-align: center;
      margin-bottom: 1rem;
      font-size: 1.2rem;
      font-weight: bold;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
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
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .bank-card .balance .amount,
    .bank-card .new-balance .amount {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
      margin-top: 0.3rem;
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
      animation: slide-up 0.5s forwards;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.3rem;
    }

    @keyframes slide-up {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .recharge-animation i {
      color: var(--positive-light);
    }

    .bank-card .card-footer {
      text-align: center;
      margin-top: 1rem;
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.3rem;
    }

    .notification-info {
      margin-top: 1rem;
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.85);
      text-align: center;
      padding: 0.75rem;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 0.5rem;
    }

    .notification-info i {
      margin-right: 0.5rem;
      color: rgba(255, 255, 255, 0.95);
    }
  `]
})
export class RechargeWithoutNotificationComponent {
  simCardIdNoNotify: number | null = null;
  rechargeCodeNoNotify: string = '';
  @Input() isLoading: boolean = false;
  @Input() errorMessage: string = '';
  @Input() previousBalance: number = 0;
  @Input() rechargeResult: SimCardAccount | null = null;
  @Output() rechargeWithoutNotification = new EventEmitter<{ simCardId: number | null, rechargeCode: string }>();
  isAnimatingRecharge: boolean = false;
  rechargeAmount: number = 0;

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
