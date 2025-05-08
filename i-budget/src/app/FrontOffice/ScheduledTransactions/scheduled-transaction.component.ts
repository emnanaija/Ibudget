import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SimTransaction, TransactionService } from '../../services/transaction.service';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/User/auth.service';

// Calendar library (Angular Component)
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { AnimatedBackgroundComponent } from '../dashboard/components/animated-background/animated-background.component';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { HeaderComponent } from '../dashboard/components/header/header.component';

@Component({
  selector: 'app-scheduled-transaction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    AnimatedBackgroundComponent,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './scheduled-transaction.component.html',
  styleUrls: ['./scheduled-transaction.component.css']
})
export class ScheduledTransactionComponent implements OnInit {
  isSidebarCollapsed = false;
  currentUserId: number | null = null;
  users: any[] = [];
  scheduledTransactions: any[] = [];
  calendarEvents: EventInput[] = [];

  // Animation state: 'hidden' (form showing), 'animating' (cards moving), 'complete' (receipt showing)
  animationState: 'hidden' | 'animating' | 'complete' = 'hidden';

  // Calendar configuration
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
    editable: true,
    selectable: true,
    weekends: true,
    events: this.calendarEvents,
    eventColor: '#4caf50',
    height: 'auto'
  };

  // Transaction model
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

  // Date and time for scheduling
  scheduledDate: string = ''; // YYYY-MM-DD
  scheduledTime: string = ''; // HH:MM
  minDate: string = '';

  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  feeNotification = false;

  // Selected event for viewing details
  selectedEvent: any = null;
  isViewingEvent = false;

  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Set min date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    // Default scheduled time to current time + 1 hour (rounded to nearest future hour)
    const nextHour = new Date();
    nextHour.setHours(nextHour.getHours() + 1);
    nextHour.setMinutes(0);
    nextHour.setSeconds(0);

    this.scheduledDate = nextHour.toISOString().split('T')[0];
    this.scheduledTime = `${String(nextHour.getHours()).padStart(2, '0')}:${String(nextHour.getMinutes()).padStart(2, '0')}`;

    // Initialize with a new reference number
    this.transaction.refNum = this.generateRefNumber();

    // Get current user ID from auth service
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.currentUserId = userId;
      this.transaction.sender = { userId: this.currentUserId };
      this.transaction.simCardAccount = { simCardId: this.currentUserId };

      // Fetch all users for receiver selection (exclude current user)
      this.userService.getAllUsers().subscribe(users => {
        this.users = users.filter(user => user.userId !== this.currentUserId);
      });

      // Load scheduled transactions for the user
      this.loadScheduledTransactions();
    } else {
      this.errorMessage = 'Unable to identify current user. Please log in again.';
      console.warn('Current user is null');
    }
  }

  loadScheduledTransactions(): void {
    if (!this.currentUserId) return;

    // Here you would call a service method to get scheduled transactions
    // For now, let's simulate it with sample data
    // In a real implementation, you'd have an endpoint like:
    // this.transactionService.getScheduledTransactions(this.currentUserId).subscribe(...)

    // Sample data - replace with API call
    const sampleTransactions = [
      {
        idTransaction: 1001,
        amount: 150.00,
        transactionType: 'Transfer',
        status: 'SCHEDULED',
        refNum: 'SCH-20250310-1430',
        descreption: 'Monthly rent payment',
        scheduledTime: '2025-03-10T14:30:00',
        feeAmount: 0.75,
        sender: { userId: this.currentUserId },
        receiver: { userId: 4, firstName: 'Jane', lastName: 'Doe' }
      },
      {
        idTransaction: 1002,
        amount: 50.00,
        transactionType: 'PAYMENT',
        status: 'SCHEDULED',
        refNum: 'SCH-20250315-0900',
        descreption: 'Internet bill',
        scheduledTime: '2025-03-15T09:00:00',
        feeAmount: 0.50,
        sender: { userId: this.currentUserId },
        receiver: { userId: 5, firstName: 'John', lastName: 'Smith' }
      }
    ];

    this.scheduledTransactions = sampleTransactions;

    // Convert transactions to calendar events
    this.calendarEvents = sampleTransactions.map(transaction => {
      return {
        id: transaction.idTransaction.toString(),
        title: `$${transaction.amount} to User #${transaction.receiver.userId}`,
        start: transaction.scheduledTime,
        extendedProps: {
          refNum: transaction.refNum,
          description: transaction.descreption,
          amount: transaction.amount,
          type: transaction.transactionType,
          receiver: transaction.receiver,
          fee: transaction.feeAmount
        }
      };
    });

    // Update calendar with events
    this.calendarOptions.events = this.calendarEvents;
  }

  handleEventClick(info: any): void {
    // Display transaction details when clicking on an event
    const transactionId = parseInt(info.event.id);
    const transaction = this.scheduledTransactions.find(t => t.idTransaction === transactionId);

    if (transaction) {
      this.selectedEvent = {
        ...transaction,
        formattedDate: new Date(transaction.scheduledTime).toLocaleString()
      };
      this.isViewingEvent = true;
    }
  }

  handleDateClick(info: any): void {
    // Pre-fill the form with the selected date
    this.scheduledDate = info.dateStr;
    this.scheduledTime = '12:00'; // Default to noon

    // Scroll to form
    document.querySelector('.form-card-content')?.scrollIntoView({ behavior: 'smooth' });
  }

  closeEventDetails(): void {
    this.isViewingEvent = false;
    this.selectedEvent = null;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  generateRefNumber(): string {
    const prefix = 'SCH';
    const timestamp = new Date().getTime().toString().slice(-8);
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
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

  getUserById(userId: number) {
    return this.users.find(user => user.userId === userId);
  }

  getUserInitials(user: any): string {
    if (!user) return '👤';
    const firstInitial = user.firstName ? user.firstName.charAt(0).toUpperCase() : '';
    const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : '';
    const initials = firstInitial + lastInitial;
    return initials || '👤';
  }

  createScheduledTransaction(): void {
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Ensure sender ID is set to current user
    if (!this.currentUserId) {
      this.errorMessage = 'User session invalid. Please log in again.';
      this.isSubmitting = false;
      return;
    }

    // Validate scheduled date and time
    if (!this.scheduledDate || !this.scheduledTime) {
      this.errorMessage = 'Please select a date and time for the scheduled transaction.';
      this.isSubmitting = false;
      return;
    }

    // Combine date and time for the scheduled time
    const scheduledTime = new Date(`${this.scheduledDate}T${this.scheduledTime}:00`);
    const now = new Date();

    // Ensure scheduled time is in the future
    if (scheduledTime <= now) {
      this.errorMessage = 'Scheduled time must be in the future.';
      this.isSubmitting = false;
      return;
    }

    // Calculate fee one more time before submitting
    this.calculateFee();

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
        simCardId: this.currentUserId
      }
    };

    console.log('Submitting scheduled transaction:', transactionPayload);
    console.log('Scheduled for:', scheduledTime.toISOString());

    this.transactionService.scheduleTransaction(transactionPayload as SimTransaction, scheduledTime)
      .subscribe({
        next: (response) => {
          console.log('Transaction scheduled successfully:', response);
          this.successMessage = `Transaction scheduled successfully for ${scheduledTime.toLocaleString()}! Reference: ${this.transaction.refNum}`;
          this.isSubmitting = false;

          // Add the new transaction to the calendar
          const newEvent = {
            id: (response.idTransaction || Date.now()).toString(),
            title: `$${response.amount} to User #${response.receiver.userId}`,
            start: scheduledTime.toISOString(),
            extendedProps: {
              refNum: response.refNum,
              description: response.descreption,
              amount: response.amount,
              type: response.transactionType,
              receiver: response.receiver,
              fee: response.feeAmount
            }
          };

          this.calendarEvents = [...this.calendarEvents, newEvent];
          this.calendarOptions.events = this.calendarEvents;

          // Start the animation sequence
          this.startTransactionAnimation();

          // Reload scheduled transactions
          this.loadScheduledTransactions();
        },
        error: (error) => {
          console.error('Error scheduling transaction:', error);
          this.errorMessage = `Failed to schedule transaction: ${error.error?.message || error.message || 'Unknown error'}`;
          this.isSubmitting = false;
        }
      });
  }

  startTransactionAnimation(): void {
    // Show the animation container
    this.animationState = 'animating';

    // After animation completes (3s for the full sequence), update state
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
      refNum: this.generateRefNumber(),
      descreption: '',
      feeAmount: 0,
      sender: { userId: this.currentUserId },
      receiver: { userId: null },
      simCardAccount: { simCardId: this.currentUserId }
    };

    // Reset date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(12, 0, 0, 0);

    this.scheduledDate = tomorrow.toISOString().split('T')[0];
    this.scheduledTime = '12:00';

    this.successMessage = '';
    this.errorMessage = '';
    this.feeNotification = false;
  }
}
