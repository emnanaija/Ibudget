import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, SimTransaction } from '../../../services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.css']
})
export class CreateTransactionComponent implements OnInit {
  feeNotification = false;
  // Animation state: 'hidden' (form showing), 'animating' (cards moving), 'complete' (receipt showing)
  animationState: 'hidden' | 'animating' | 'complete' = 'hidden';

  transaction: Partial<SimTransaction> = {
    amount: 0,
    transactionType: 'Transfer',
    status: 'PENDING',
    refNum: this.generateRefNumber(),
    descreption: '',
    feeAmount: 0,
    sender: { userId: null },
    receiver: { userId: null },
    simCardAccount: { simCardId: null }
  };

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize with a new reference number
    this.transaction.refNum = this.generateRefNumber();
  }

  generateRefNumber(): string {
    const prefix = 'TX';
    const timestamp = new Date().getTime().toString().slice(-8);
    const randomDigits = Math.floor(1000 + Math.random() * 9000); // 4 digit number
    return `${prefix}-${timestamp}-${randomDigits}`;
  }

  calculateFee(): void {
    if (!this.transaction.amount) return;

    // Calculate fee based on amount and transaction type
    let feePercentage = 0;

    switch (this.transaction.transactionType) {
      case 'Transfer':
        feePercentage = 0.005; // 0.5%
        break;
      case 'PAYMENT':
        feePercentage = 0.01; // 1%
        break;
      case 'HederaToken':
        feePercentage = 0.02; // 2%
        break;
      case 'SUBSCRIPTION':
        feePercentage = 0.015; // 1.5%
        break;
      case 'LocalCurrency':
        feePercentage = 0.0075; // 0.75%
        break;
      default:
        feePercentage = 0.01; // Default 1%
    }

    // Calculate and show fee
    this.transaction.feeAmount = parseFloat((this.transaction.amount * feePercentage).toFixed(2));
    this.feeNotification = true;
  }

  updateSimCardId(): void {
    // Automatically set simCardId to the same value as senderId
    if (this.transaction.sender && this.transaction.sender.userId) {
      this.transaction.simCardAccount = {
        simCardId: this.transaction.sender.userId
      };
    }
  }

  createTransaction(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Calculate fee one more time before submitting
    this.calculateFee();

    // Update simCardId to match sender userId
    this.updateSimCardId();

    // Prepare the transaction object
    const transactionPayload = {
      amount: this.transaction.amount,
      transactionType: this.transaction.transactionType,
      status: 'PENDING',
      refNum: this.transaction.refNum,
      descreption: this.transaction.descreption,
      feeAmount: this.transaction.feeAmount,
      sender: {
        userId: this.transaction.sender.userId
      },
      receiver: {
        userId: this.transaction.receiver.userId
      },
      simCardAccount: {
        simCardId: this.transaction.sender.userId // Use sender ID for simCardId automatically
      }
    };

    console.log('Submitting transaction:', transactionPayload);

    this.transactionService.createTransaction(transactionPayload as SimTransaction)
      .subscribe({
        next: (response) => {
          console.log('Transaction created successfully:', response);
          this.successMessage = `Transaction created successfully! Reference: ${this.transaction.refNum}`;
          this.isSubmitting = false;

          // Start the animation sequence
          this.startTransactionAnimation();
        },
        error: (error) => {
          console.error('Error creating transaction:', error);
          this.errorMessage = `Failed to create transaction: ${error.error?.message || error.message || 'Unknown error'}`;
          this.isSubmitting = false;
        }
      });
  }

  startTransactionAnimation(): void {
    // Show the animation container
    this.animationState = 'animating';

    // After animation completes (3s for the full sequence), update state
    // Increased from 1.5s to 3s for a longer animation sequence
    setTimeout(() => {
      this.animationState = 'complete';
    }, 3000);
  }

  resetAnimation(): void {
    // Reset animation state and form
    this.animationState = 'hidden';
    this.resetForm();
  }

  navigateToTransactions(): void {
    this.router.navigate(['/transactions']);
  }

  resetForm(): void {
    this.transaction = {
      amount: 0,
      transactionType: 'Transfer',
      status: 'PENDING',
      refNum: this.generateRefNumber(), // Generate new reference number
      descreption: '',
      feeAmount: 0,
      sender: { userId: null },
      receiver: { userId: null },
      simCardAccount: { simCardId: null }
    };

    this.successMessage = '';
    this.errorMessage = '';
    this.feeNotification = false;
  }
}
