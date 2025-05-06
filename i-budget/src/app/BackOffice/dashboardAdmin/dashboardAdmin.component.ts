import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  Injector
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService, User } from '../../services/user.service';
import { TransactionService, SimTransaction } from '../../services/transaction.service';
import { gsap } from 'gsap';
import { AnimatedBackgroundComponent } from '../../FrontOffice/dashboard/components/animated-background/animated-background.component';
import { MonteCarloSimulationComponent } from '../MonteCarloSim/monte-carlo-simulation.component';
import {BackofficeNavbarComponent} from '../BackofficeNavbarComponent/BackofficeNavbarComponent';

interface TransactionGroup {
  date: string;
  items: SimTransaction[];
}

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    AnimatedBackgroundComponent,
    MonteCarloSimulationComponent,
    BackofficeNavbarComponent
  ],
  templateUrl: './dashboardAdmin.component.html',
  styleUrls: ['./dashboardAdmin.component.css']
})
export class DashboardAdminComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('bankCard') bankCard!: ElementRef;
  @ViewChild('balanceAmount') balanceAmount!: ElementRef;
  @ViewChild('transactionsList') transactionsList!: ElementRef;
  @ViewChild('userList') userList!: ElementRef;
  @ViewChild('mainDashboard') mainDashboard!: ElementRef;

  users: User[] = [];
  selectedUser: User | null = null;
  selectedSimCardId: number | undefined;
  transactions: TransactionGroup[] = [];
  filteredTransactions: TransactionGroup[] = [];
  searchQuery: string = '';
  activeFilter: 'all' | 'income' | 'expenses' = 'all';

  showAdvancedOptions: boolean = false;
  newTransaction: SimTransaction = {
    idTransaction: 0,
    amount: 0,
    transactionType: '',
    status: '',
    refNum: '',
    descreption: '',
    transactionDate: new Date().toISOString(),
    feeAmount: 0,
    simCardAccount: null,
    sender: null,
    receiver: null,
    payment: null,
  };

  scheduledTime: Date = new Date();
  recurringStartTime: Date = new Date();
  recurringIntervalDays: number = 1;
  recurringRepetitions: number = 5;
  conditionalThreshold: number = 0;
  batchTransactionsList: SimTransaction[] = [];
  newBatchTransaction: SimTransaction = { ...this.newTransaction };

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private injector: Injector
  ) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  ngOnDestroy(): void {
    // Cleanup code if needed
  }

  initAnimations() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.bankCard?.nativeElement) {
        gsap.from(this.bankCard.nativeElement, {
          y: 50,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });

        // Cursor-following animation
        const card = this.bankCard.nativeElement;
        const cardBounds = card.getBoundingClientRect();
        const cardCenterX = cardBounds.left + cardBounds.width / 2;
        const cardCenterY = cardBounds.top + cardBounds.height / 2;

        document.addEventListener('mousemove', (e) => {
          const mouseX = e.clientX;
          const mouseY = e.clientY;

          const deltaX = (mouseX - cardCenterX) / cardBounds.width;
          const deltaY = (mouseY - cardCenterY) / cardBounds.height;

          gsap.to(card, {
            x: deltaX * 20,
            y: deltaY * 20,
            rotationY: deltaX * 15,
            rotationX: -deltaY * 15,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto'
          });
        });

        // Reset on mouse leave
        document.addEventListener('mouseleave', () => {
          gsap.to(card, {
            x: 0,
            y: 0,
            rotationY: 0,
            rotationX: 0,
            duration: 0.5,
            ease: 'power2.out'
          });
        });
      }

      if (this.balanceAmount?.nativeElement) {
        gsap.from(this.balanceAmount.nativeElement, {
          scale: 0.5,
          opacity: 0,
          duration: 1,
          delay: 0.5,
          ease: 'back.out(1.7)'
        });
      }

      if (this.transactionsList?.nativeElement) {
        gsap.from('.transaction-item', {
          x: -50,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: this.transactionsList.nativeElement,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        });
      }
    }
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        if (users.length > 0) {
          this.selectUser(users[0]);
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
    this.loadTransactions(user.userId);

    if (isPlatformBrowser(this.platformId) && this.userList?.nativeElement) {
      const userCards = this.userList.nativeElement.querySelectorAll('.user-card');
      const selectedCard = this.userList.nativeElement.querySelector('.user-card.selected');

      if (userCards.length > 0) {
        gsap.to(userCards, {
          scale: 1,
          opacity: 1,
          duration: 0.3
        });
      }

      if (selectedCard) {
        gsap.to(selectedCard, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    }

    this.createMoneyEffect();
  }

  createMoneyEffect() {
    if (isPlatformBrowser(this.platformId)) {
      const moneyEffect = document.createElement('div');
      moneyEffect.className = 'money-effect';

      const size = Math.random() * 30 + 20;
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight * 0.7;

      moneyEffect.style.left = `${startX}px`;
      moneyEffect.style.top = `${startY}px`;
      document.body.appendChild(moneyEffect);

      const driftX = (Math.random() - 0.5) * 50;
      const driftY = Math.random() * 50;

      gsap.to(moneyEffect, {
        y: startY - 100,
        x: startX + driftX,
        scale: Math.random() * 1.5 + 0.5,
        opacity: 0,
        duration: 1 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => moneyEffect.remove()
      });
    }
  }

  loadTransactions(userId: number): void {
    this.transactionService.getTransactionsByUserId(userId).subscribe({
      next: (transactions: SimTransaction[]) => {
        this.transactions = this.groupTransactionsByDate(transactions);
        this.filterTransactions();
      },
      error: (error: any) => {
        console.error('Error loading transactions:', error);
      }
    });
  }

  private groupTransactionsByDate(transactions: SimTransaction[]): TransactionGroup[] {
    const groups: { [key: string]: SimTransaction[] } = {};

    transactions.forEach(transaction => {
      const date = new Date(transaction.transactionDate).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      items: items.sort((a, b) =>
        new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
      )
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getGroupTotal(group: TransactionGroup): number {
    return group.items.reduce((sum, transaction) => sum + transaction.amount, 0);
  }

  getCategoryClass(category: string): string {
    // Add null check before calling toLowerCase()
    if (!category) {
      return 'other'; // Return a default class when category is null
    }
    
    switch (category.toLowerCase()) {
      case 'income':
        return 'income';
      case 'expense':
        return 'expense';
      default:
        return 'other';
    }
  }

  filterTransactions(): void {
    let filtered = [...this.transactions];

    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.descreption?.toLowerCase().includes(query) ||
          item.transactionType.toLowerCase().includes(query)
        )
      })).filter(group => group.items.length > 0);
    }

    if (this.activeFilter !== 'all') {
      filtered = filtered.map(group => ({
        ...group,
        items: group.items.filter(item =>
          this.activeFilter === 'income' ? item.amount > 0 : item.amount < 0
        )
      })).filter(group => group.items.length > 0);
    }

    this.filteredTransactions = filtered;
  }

  setFilter(filter: 'all' | 'income' | 'expenses'): void {
    this.activeFilter = filter;
    this.filterTransactions();
  }

  toggleAdvancedOptions(): void {
    this.showAdvancedOptions = !this.showAdvancedOptions;
  }

  // We'll keep all the transaction-related methods

  scheduleNewTransaction(): void {
    if (this.selectedUser && this.newTransaction.amount && this.newTransaction.transactionType) {
      this.newTransaction.simCardAccount = this.selectedUser.simCardAccount;

      // Convert scheduledTime string to a Date object
      const scheduledTimeToSend = new Date(this.scheduledTime);

      this.transactionService.scheduleTransaction(this.newTransaction, scheduledTimeToSend).subscribe({
        next: (scheduledTransaction) => {
          console.log('Transaction scheduled:', scheduledTransaction);
          this.loadTransactions(this.selectedUser!.userId); // Reload transactions
          this.resetNewTransaction();
          this.showAdvancedOptions = false;

          // Add visual feedback
          this.showNotification('Transaction scheduled successfully!', 'success');
        },
        error: (error) => {
          console.error('Error scheduling transaction:', error);
          this.showNotification('Failed to schedule transaction', 'error');
        }
      });
    } else {
      this.showNotification('Please fill in all required transaction details', 'warning');
    }
  }

  scheduleNewRecurringTransaction(): void {
    if (this.selectedUser && this.newTransaction.amount && this.newTransaction.transactionType &&
      this.recurringIntervalDays > 0 && this.recurringRepetitions > 0) {
      this.newTransaction.simCardAccount = this.selectedUser.simCardAccount;

      this.transactionService.scheduleRecurringTransaction(
        this.newTransaction,
        this.recurringStartTime,
        this.recurringIntervalDays,
        this.recurringRepetitions
      ).subscribe({
        next: (recurringTransactions) => {
          console.log('Recurring transactions scheduled:', recurringTransactions);
          this.loadTransactions(this.selectedUser!.userId); // Reload transactions
          this.resetNewTransaction();
          this.showAdvancedOptions = false;

          // Add visual feedback with animations
          this.showNotification(`${this.recurringRepetitions} recurring transactions scheduled`, 'success');
          this.createRecurringEffect();
        },
        error: (error) => {
          console.error('Error scheduling recurring transactions:', error);
          this.showNotification('Failed to schedule recurring transactions', 'error');
        }
      });
    } else {
      this.showNotification('Please fill in all required details for recurring transaction', 'warning');
    }
  }

  triggerConditionalTransaction(): void {
    if (this.selectedUser && this.newTransaction.amount && this.newTransaction.transactionType) {
      this.newTransaction.simCardAccount = this.selectedUser.simCardAccount;

      this.transactionService.conditionalTransaction(
        this.newTransaction,
        this.conditionalThreshold
      ).subscribe({
        next: (conditionalTransaction) => {
          console.log('Conditional transaction triggered:', conditionalTransaction);
          this.loadTransactions(this.selectedUser!.userId); // Reload transactions
          this.resetNewTransaction();
          this.showAdvancedOptions = false;

          // Add visual feedback
          this.showNotification('Conditional transaction created successfully', 'success');
          this.createConditionalEffect();
        },
        error: (error) => {
          console.error('Error triggering conditional transaction:', error);
          this.showNotification(error.error || 'Failed to create conditional transaction', 'error');
        }
      });
    } else {
      this.showNotification('Please fill in all required transaction details', 'warning');
    }
  }

  addBatchTransaction(): void {
    if (!this.newBatchTransaction.amount || !this.newBatchTransaction.transactionType) {
      this.showNotification('Please fill in all batch transaction details', 'warning');
      return;
    }

    // Create a copy to avoid reference issues
    const transaction = {
      ...this.newBatchTransaction,
      simCardAccount: this.selectedUser?.simCardAccount
    };

    this.batchTransactionsList.push(transaction);

    // Reset form for next entry
    this.newBatchTransaction = {
      ...this.newTransaction,
      amount: 0,
      transactionType: '',
      descreption: ''
    };

    // Visual feedback
    this.animateBatchAddition();
  }

  submitBatchTransactions(): void {
    if (this.selectedUser && this.batchTransactionsList.length > 0) {
      this.transactionService.batchTransactions(this.batchTransactionsList).subscribe({
        next: (batchedTransactions) => {
          console.log('Batch transactions submitted:', batchedTransactions);
          this.loadTransactions(this.selectedUser!.userId); // Reload transactions

          // Visual feedback
          const count = this.batchTransactionsList.length;
          this.showNotification(`${count} batch transactions processed successfully`, 'success');
          this.createBatchEffect();

          // Clear the batch list
          this.batchTransactionsList = [];
          this.showAdvancedOptions = false;
        },
        error: (error) => {
          console.error('Error submitting batch transactions:', error);
          this.showNotification('Failed to process batch transactions', 'error');
        }
      });
    } else {
      this.showNotification('Please add transactions to the batch', 'warning');
    }
  }

  resetNewTransaction(): void {
    this.newTransaction = {
      idTransaction: 0,
      amount: 0,
      transactionType: '',
      status: '',
      refNum: '',
      descreption: '',
      transactionDate: new Date().toISOString(),
      feeAmount: 0,
      simCardAccount: null,
      sender: null,
      receiver: null,
      payment: null,
    };
  }

  // Helper methods for visual feedback

  showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    if (isPlatformBrowser(this.platformId)) {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-icon">
            ${type === 'success' ? '✓' : type === 'error' ? '✕' : '⚠'}
          </span>
          <span>${message}</span>
        </div>
      `;

      document.body.appendChild(notification);

      // Animate in
      gsap.fromTo(notification,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
      );

      // Auto remove after delay
      setTimeout(() => {
        gsap.to(notification, {
          opacity: 0,
          y: -20,
          duration: 0.5,
          onComplete: () => notification.remove()
        });
      }, 4000);
    }
  }

  createRecurringEffect(): void {
    if (isPlatformBrowser(this.platformId)) {
      for (let i = 0; i < this.recurringRepetitions; i++) {
        setTimeout(() => {
          this.createMoneyEffect();
        }, i * 300);
      }
    }
  }

  createConditionalEffect(): void {
    if (isPlatformBrowser(this.platformId) && this.balanceAmount?.nativeElement) {
      // Highlight balance with pulse animation
      gsap.fromTo(
        this.balanceAmount.nativeElement,
        { scale: 1 },
        {
          scale: 1.1,
          duration: 0.3,
          repeat: 3,
          yoyo: true,
          ease: 'power2.inOut'
        }
      );

      // Show threshold line animation
      const balanceContainer = this.balanceAmount.nativeElement.parentElement;
      const thresholdLine = document.createElement('div');
      thresholdLine.className = 'threshold-line';
      thresholdLine.style.position = 'absolute';
      thresholdLine.style.height = '2px';
      thresholdLine.style.width = '0';
      thresholdLine.style.backgroundColor = '#ffaf7b';
      thresholdLine.style.bottom = '35px';
      thresholdLine.style.left = '0';

      balanceContainer.style.position = 'relative';
      balanceContainer.appendChild(thresholdLine);

      gsap.to(thresholdLine, {
        width: '100%',
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
          setTimeout(() => {
            gsap.to(thresholdLine, {
              opacity: 0,
              duration: 0.5,
              onComplete: () => thresholdLine.remove()
            });
          }, 2000);
        }
      });
    }
  }

  animateBatchAddition(): void {
    if (isPlatformBrowser(this.platformId)) {
      const batchList = document.querySelector('.advanced-transactions ul');
      if (batchList && batchList.lastElementChild) {
        const lastItem = batchList.lastElementChild;

        gsap.fromTo(lastItem,
          { x: -20, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3 }
        );
      }
    }
  }

  createBatchEffect(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Create multiple money effects in a sequence
      for (let i = 0; i < Math.min(this.batchTransactionsList.length, 10); i++) {
        setTimeout(() => {
          this.createMoneyEffect();
        }, i * 100);
      }
    }
  }

  // Navigation methods
  navigateToAccounts(): void {
    this.router.navigate(['/admin/accounts']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}
