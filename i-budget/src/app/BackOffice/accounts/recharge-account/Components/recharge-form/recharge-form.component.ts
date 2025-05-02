import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AccountService, SimCardAccount } from '../../../../../services/account.service';

@Component({
  selector: 'app-recharge-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="recharge-form-container">
      <h3><i class="fas fa-wallet"></i> Recharge Account</h3>

      <div class="form-group">
        <label for="simCardId"><i class="fas fa-sim-card"></i> Sim Card ID:</label>
        <div class="input-with-icon">
          <i class="fas fa-id-card input-icon"></i>
          <input type="number" id="simCardId" [(ngModel)]="simCardId" placeholder="Enter Sim Card ID">
        </div>
      </div>

      <div class="form-group">
        <label for="rechargeCode"><i class="fas fa-key"></i> Recharge Code:</label>
        <div class="input-with-icon">
          <i class="fas fa-barcode input-icon"></i>
          <input type="text" id="rechargeCode" [(ngModel)]="rechargeCode" placeholder="Enter Recharge Code">
        </div>
      </div>

      <button (click)="rechargeClicked()" [disabled]="isLoading" class="recharge-button">
        <span *ngIf="!isLoading">
          <i class="fas fa-paper-plane"></i> Recharge & Get SMS Notification
        </span>
        <span *ngIf="isLoading" class="processing-animation">
          <div class="animation-container">
            <i class="fas fa-mobile-alt phone-icon"></i>
            <i class="fas fa-sms sms-icon"></i>
            <i class="fas fa-wallet wallet-icon"></i>
            <div class="pulse-circle"></div>
          </div>
          <span class="processing-text">Processing Recharge & Sending SMS...</span>
        </span>
      </button>

      <!-- Success SMS Animation -->
      <div *ngIf="showSuccessAnimation" class="success-sms-animation">
        <div class="mobile-device">
          <div class="mobile-screen">
            <div class="status-bar">
              <div class="status-icons">
                <i class="fas fa-signal"></i>
                <i class="fas fa-wifi"></i>
                <i class="fas fa-battery-three-quarters"></i>
              </div>
              <div class="status-time">{{ currentTime }}</div>
            </div>
            
            <div class="notification-banner">
              <i class="fas fa-sms notification-icon"></i>
              <div class="notification-content">
                <div class="notification-title">Mobile Recharge</div>
                <div class="notification-preview">Your account has been recharged successfully!</div>
              </div>
              <div class="notification-time">now</div>
            </div>
            
            <div class="message-app">
              <div class="message-header">
                <i class="fas fa-arrow-left"></i>
                <div class="contact-info">
                  <div class="contact-name">Mobile Provider</div>
                  <div class="contact-status">Online</div>
                </div>
                <i class="fas fa-ellipsis-v"></i>
              </div>
              
              <div class="messages-container">
                <div class="message-date-divider">{{ currentShortDate }}</div>
                
                <div class="message received">
                  <div class="message-content">
                    <div class="message-text">
                      <p><strong>Recharge Successful!</strong> 🎉</p>
                      <p>Your account has been recharged with <strong>{{ rechargeAmount }} {{ currency }}</strong></p>
                      <p>New balance: <strong>{{ balance }} {{ currency }}</strong></p>
                      <p>Transaction Ref: <strong>{{ refNum }}</strong></p>
                    </div>
                    <div class="message-time">{{ currentMessageTime }}</div>
                  </div>
                </div>
              </div>
              
              <div class="message-input">
                <i class="fas fa-plus-circle"></i>
                <input type="text" placeholder="Message" disabled>
                <i class="fas fa-paper-plane send-disabled"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle"></i> Error: {{ errorMessage }}
      </div>

      <div class="notification-info">
        <i class="fas fa-info-circle"></i> You will receive an SMS confirmation after successful recharge.
      </div>
    </div>
  `,
  styles: [`
    .recharge-form-container {
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
      background-color: var(--primary);
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
      background-color: var(--primary-dark);
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

    .error-message {
      color: var(--negative);
      margin-top: 1rem;
      font-size: 0.9rem;
      padding: 0.75rem;
      background-color: rgba(var(--negative-rgb), 0.1);
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
    }

    .error-message i {
      margin-right: 0.5rem;
      color: var(--negative);
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

    .phone-icon {
      position: absolute;
      left: 30%;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.2rem;
      animation: phone-pulse 2s infinite;
    }

    .sms-icon {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.2rem;
      animation: sms-move 2s infinite;
    }

    .wallet-icon {
      position: absolute;
      right: 30%;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.2rem;
      animation: wallet-pulse 2s infinite;
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

    /* Modern Mobile SMS Animation Styles */
    .success-sms-animation {
      margin-top: 2rem;
      display: flex;
      justify-content: center;
      animation: fade-in 0.5s ease-in-out;
    }

    .mobile-device {
      width: 280px;
      height: 550px;
      background-color: #000;
      border-radius: 36px;
      padding: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
      border: 6px solid #333;
      animation: float 3s ease-in-out infinite;
    }

    .mobile-screen {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #1a2a6c, #b21f1f, #fdbb2d);
      border-radius: 26px;
      overflow: hidden;
      position: relative;
    }

    .status-bar {
      height: 24px;
      background-color: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      color: white;
      font-size: 12px;
    }

    .status-icons {
      display: flex;
      gap: 5px;
    }

    .notification-banner {
      background-color: rgba(255, 255, 255, 0.95);
      margin: 10px;
      border-radius: 12px;
      padding: 12px;
      display: flex;
      align-items: center;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
      animation: slide-down 0.5s ease-out;
    }

    .notification-icon {
      background-color: #007AFF;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
    }

    .notification-content {
      flex: 1;
    }

    .notification-title {
      font-weight: bold;
      font-size: 13px;
      color: #000;
    }

    .notification-preview {
      font-size: 12px;
      color: #555;
      margin-top: 2px;
    }

    .notification-time {
      font-size: 11px;
      color: #888;
    }

    .message-app {
      position: absolute;
      top: 70px;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #fff;
      border-radius: 24px 24px 0 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      animation: slide-up 0.6s ease-out 0.5s both;
    }

    .message-header {
      background-color: #f5f5f5;
      padding: 15px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e5e5e5;
    }

    .message-header i {
      color: #007AFF;
      font-size: 16px;
    }

    .contact-info {
      flex: 1;
      text-align: center;
    }

    .contact-name {
      font-weight: bold;
      font-size: 16px;
      color: #333;
    }

    .contact-status {
      font-size: 12px;
      color: #2ecc71;
    }

    .messages-container {
      flex: 1;
      padding: 15px;
      background-color: #f9f9f9;
      overflow-y: auto;
    }

    .message-date-divider {
      text-align: center;
      font-size: 12px;
      color: #888;
      margin: 10px 0;
      position: relative;
    }

    .message-date-divider:before, .message-date-divider:after {
      content: '';
      position: absolute;
      top: 50%;
      width: 30%;
      height: 1px;
      background-color: #e0e0e0;
    }

    .message-date-divider:before {
      left: 0;
    }

    .message-date-divider:after {
      right: 0;
    }

    .message {
      margin-bottom: 15px;
      display: flex;
      flex-direction: column;
    }

    .message.received {
      align-items: flex-start;
    }

    .message-content {
      max-width: 80%;
      animation: message-pop 0.5s ease-out 1s both;
    }

    .message.received .message-content {
      background-color: #e5e5ea;
      border-radius: 18px 18px 18px 4px;
    }

    .message-text {
      padding: 10px 14px;
      font-size: 14px;
      color: #333;
    }

    .message-text p {
      margin: 5px 0;
    }

    .message-time {
      font-size: 11px;
      color: #888;
      text-align: right;
      margin-top: 2px;
      margin-right: 8px;
    }

    .message-input {
      background-color: #f5f5f5;
      padding: 12px;
      display: flex;
      align-items: center;
      border-top: 1px solid #e5e5e5;
    }

    .message-input i {
      color: #999;
      font-size: 18px;
      margin: 0 10px;
    }

    .message-input input {
      flex: 1;
      border: none;
      background-color: #fff;
      border-radius: 20px;
      padding: 10px 15px;
      outline: none;
      font-size: 14px;
    }

    .send-disabled {
      opacity: 0.5;
    }

    @keyframes phone-pulse {
      0% { transform: translateY(-50%) scale(1); opacity: 0.7; }
      25% { transform: translateY(-50%) scale(1.2); opacity: 1; }
      50% { transform: translateY(-50%) scale(1); opacity: 0.7; }
      100% { transform: translateY(-50%) scale(1); opacity: 0.7; }
    }

    @keyframes sms-move {
      0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; left: 40%; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; left: 50%; }
      100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; left: 60%; }
    }

    @keyframes wallet-pulse {
      0% { transform: translateY(-50%) scale(1); opacity: 0.7; }
      50% { transform: translateY(-50%) scale(1); opacity: 0.7; }
      75% { transform: translateY(-50%) scale(1.2); opacity: 1; }
      100% { transform: translateY(-50%) scale(1); opacity: 0.7; }
    }

    @keyframes pulse {
      0% { width: 40px; height: 40px; opacity: 0.5; }
      50% { width: 70px; height: 70px; opacity: 0.2; }
      100% { width: 40px; height: 40px; opacity: 0.5; }
    }

    @keyframes fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }

    @keyframes slide-down {
      0% { transform: translateY(-50px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }

    @keyframes slide-up {
      0% { transform: translateY(100%); }
      100% { transform: translateY(0); }
    }

    @keyframes message-pop {
      0% { transform: scale(0.5); opacity: 0; }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); opacity: 1; }
    }
  `]
})
export class RechargeFormComponent implements OnInit {
  @Input() simCardId: number | null = null;
  @Input() rechargeCode: string = '';
  @Input() isLoading: boolean = false;
  @Input() errorMessage: string = '';
  @Input() showSuccessAnimation: boolean = false;
  
  // Simplified data properties for SMS content
  @Input() balance: number = 0;
  @Input() currency: string = 'TND';
  @Input() rechargeAmount: number = 0;
  @Input() refNum: string = '';

  constructor(private http: HttpClient, private accountService: AccountService) {}
  
  ngOnInit(): void {
    // If you want to show the animation immediately for testing
    // this.simulateSuccessfulRecharge();
  }
  
  get currentTime(): string {
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }
  
  get currentShortDate(): string {
    return new Date().toLocaleDateString([], {month: 'short', day: 'numeric'});
  }
  
  get currentMessageTime(): string {
    return new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  }

  @Output() recharge = new EventEmitter<{ simCardId: number | null, rechargeCode: string }>();

  rechargeClicked(): void {
    if (this.simCardId && this.rechargeCode) {
      this.isLoading = true;
      this.errorMessage = '';
      
      // Use the AccountService to recharge the account
      this.accountService.rechargeAccount(this.simCardId, this.rechargeCode)
        .subscribe({
          next: (response: SimCardAccount) => {
            this.handleSuccessResponse(response);
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            this.errorMessage = error.message || 'An error occurred during the recharge process.';
          }
        });
    } else {
      this.errorMessage = 'Please enter Sim Card ID and Recharge Code.';
    }
  }
  
  // Handle the response from the API
  handleSuccessResponse(response: any): void {
    // Extract data from response
    this.balance = response.balance || 0;
    this.currency = response.currency || 'TND';
    
    // Get recharge amount from the recharge card if available
    if (response.rechargeCards && response.rechargeCards.length > 0) {
      // Find the recharge card that was just used
      const rechargeCard = response.rechargeCards.find((card: any) => 
        card.code === this.rechargeCode
      );
      
      if (rechargeCard) {
        this.rechargeAmount = rechargeCard.amount;
      }
    }
    
    // Get reference number from the latest transaction if available
    if (response.transactions && response.transactions.length > 0) {
      const latestTransaction = response.transactions[response.transactions.length - 1];
      this.refNum = latestTransaction.refNum;
    }
    
    // Show the animation
    this.showSuccessAnimation = true;
    
    // Emit the recharge event for parent components that might be listening
    this.recharge.emit({ simCardId: this.simCardId, rechargeCode: this.rechargeCode });
  }
  
  // For testing without API
  simulateSuccessfulRecharge(): void {
    this.isLoading = true;
    
    // Simulate API delay
    setTimeout(() => {
      const mockResponse = {
        simCardId: 1,
        balance: 15836,
        currency: "TND",
        rechargeCards: [
          {
            id: 142,
            code: this.rechargeCode || "EEAA08D14702",
            amount: 100,
            used: true
          }
        ],
        transactions: [
          {
            idTransaction: 172,
            amount: 100,
            refNum: "TRF754885",
            status: "COMPLETED"
          }
        ]
      };
      
      this.handleSuccessResponse(mockResponse);
      this.isLoading = false;
    }, 2000);
  }
}