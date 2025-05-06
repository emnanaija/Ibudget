import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {SimTransaction, TransactionService} from '../../services/transaction.service';
import {UserService} from '../../services/user.service';
import { AuthService } from '../../services/User/auth.service';

import {AnimatedBackgroundComponent} from '../dashboard/components/animated-background/animated-background.component';
import {SidebarComponent} from '../dashboard/components/sidebar/sidebar.component';
import {HeaderComponent} from '../dashboard/components/header/header.component';

@Component({
  selector: 'app-create-transaction-front',
  standalone: true,
  imports: [CommonModule, FormsModule, AnimatedBackgroundComponent, SidebarComponent, HeaderComponent],
  templateUrl: './create-transaction-front.component.html',
  styleUrls: ['./create-transaction-front.component.css']
})
export class CreateTransactionFrontComponent implements OnInit {
  feeNotification = false;
  // Animation state: 'hidden' (form showing), 'animating' (cards moving), 'complete' (receipt showing)
  animationState: 'hidden' | 'animating' | 'complete' = 'hidden';
  currentUserId: number | null = null; // Store current user ID

  public users: any[] = []; // List of users for receiver selection

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
    private userService: UserService, // Inject UserService
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Initialize with a new reference number
    this.transaction.refNum = this.generateRefNumber();

    // Get current user ID from auth service synchronously
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.currentUserId = userId;
      this.transaction.sender = { userId: this.currentUserId };
      this.transaction.simCardAccount = { simCardId: this.currentUserId };

      // Fetch all users and filter out current user for receiver selection
      this.userService.getAllUsers().subscribe(users => {
        this.users = users.filter(user => user.userId !== this.currentUserId);
      });
    } else {
      this.errorMessage = 'Unable to identify current user. Please log in again.';
      console.warn('Current user is null');
    }
  }

  getUserById(userId: number) {
    console.log('getUserById called with:', userId);
    const user = this.users.find(user => user.userId === userId);
    console.log('getUserById result:', user);
    return user;
  }

  getUserInitials(user: any): string {
    console.log('getUserInitials called with:', user);
    if (!user) return '👤';
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    const initials = firstInitial + lastInitial;
    console.log('getUserInitials result:', initials);
    return initials || '👤';
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
    // Always use the current user ID for simCardAccount
    if (this.currentUserId) {
      this.transaction.simCardAccount = {
        simCardId: this.currentUserId
      };
    }
  }

  createTransaction(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Ensure sender ID is set to current user
    if (!this.currentUserId) {
      this.errorMessage = 'User session invalid. Please log in again.';
      this.isSubmitting = false;
      return;
    }

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
        userId: this.currentUserId
      },
      receiver: {
        userId: this.transaction.receiver.userId
      },
      simCardAccount: {
        simCardId: this.currentUserId // Use current user ID for simCardId automatically
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
  isSidebarCollapsed = false;

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
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

  

  resetForm(): void {
    // Reset form but keep sender ID as current user
    this.transaction = {
      amount: 0,
      transactionType: 'Transfer',
      status: 'PENDING',
      refNum: this.generateRefNumber(), // Generate new reference number
      descreption: '',
      feeAmount: 0,
      sender: { userId: this.currentUserId }, // Keep current user as sender
      receiver: { userId: null },
      simCardAccount: { simCardId: this.currentUserId } // Keep current user as simCardId
    };

    this.successMessage = '';
    this.errorMessage = '';
    this.feeNotification = false;
  }
}
