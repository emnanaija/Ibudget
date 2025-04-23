// transactions.component.ts
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { gsap } from 'gsap';
import { TransactionService, SimTransaction } from '../../../services/transaction.service';
import { UserService, User } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';

interface TransactionGroup {
  date: string;
  items: SimTransaction[];
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('balanceCard') balanceCard!: ElementRef;
  @ViewChild('transactionsCard') transactionsCard!: ElementRef;
  
  transactions: TransactionGroup[] = [];
  protected readonly Math = Math;
  currentUser: User | null = null;
  
  // Search functionality
  searchQuery: string = '';
  filteredTransactions: TransactionGroup[] = [];

  // Filter functionality
  activeFilter: 'all' | 'income' | 'expenses' = 'all';
  
  constructor(
    private transactionService: TransactionService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const userId = +params['id'];
      if (userId) {
        this.loadUser(userId);
        this.loadTransactions(userId);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  initAnimations(): void {
    if (!this.balanceCard?.nativeElement || !this.transactionsCard?.nativeElement) {
      return;
    }

    // Balance card animation
    gsap.from(this.balanceCard.nativeElement, {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.2
    });

    // Transactions card animation
    gsap.from(this.transactionsCard.nativeElement, {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.4
    });

    // Add tilt effect to balance card
    this.balanceCard.nativeElement.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = this.balanceCard.nativeElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateY = ((x - centerX) / centerX) * 10;
      const rotateX = ((centerY - y) / centerY) * 10;
      
      gsap.to(this.balanceCard.nativeElement, {
        duration: 0.5,
        rotateX: rotateX,
        rotateY: rotateY,
        ease: 'power2.out'
      });
    });

    this.balanceCard.nativeElement.addEventListener('mouseleave', () => {
      gsap.to(this.balanceCard.nativeElement, {
        duration: 0.8,
        rotateX: 0,
        rotateY: 0,
        ease: 'elastic.out(1, 0.3)'
      });
    });
  }

  loadUser(userId: number): void {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.currentUser = null;
      }
    });
  }

  loadTransactions(userId: number): void {
    this.transactionService.getTransactionsByUserId(userId).subscribe({
      next: (transactions: SimTransaction[]) => {
        this.transactions = this.groupTransactionsByDate(transactions);
        this.filteredTransactions = [...this.transactions];
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.transactions = [];
        this.filteredTransactions = [];
      }
    });
  }

  private groupTransactionsByDate(transactions: SimTransaction[]): TransactionGroup[] {
    const groups: { [key: string]: SimTransaction[] } = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.transactionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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
    return group.items.reduce((total, item) => total + item.amount, 0);
  }

  getCategoryClass(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Grocery': 'category-grocery',
      'Transportation': 'category-transportation',
      'Housing': 'category-housing',
      'Food and Drink': 'category-food',
      'Entertainment': 'category-entertainment'
    };
    return categoryMap[category] || 'category-default';
  }

  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterTransactions();
  }

  setFilter(filter: 'all' | 'income' | 'expenses'): void {
    this.activeFilter = filter;
    this.filterTransactions();
  }

  private filterTransactions(): void {
    let filtered = [...this.transactions];
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.map(group => ({
        ...group,
        items: group.items.filter(item => 
          item.transactionType?.toLowerCase().includes(query) ||
          item.descreption?.toLowerCase().includes(query)
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
}
