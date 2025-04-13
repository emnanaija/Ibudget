// transactions.component.ts
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Add this import
import { gsap } from 'gsap';

interface TransactionItem {
  category: string;
  amount: number;
  date?: string;
}

interface TransactionGroup {
  date: string;
  items: TransactionItem[];
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, AfterViewInit {
  @ViewChild('transactionsCard') card!: ElementRef;
  
  transactions: TransactionGroup[] = [
    {
      date: 'Today',
      items: [
        { category: 'Grocery', amount: -326.80 },
        { category: 'Transportation', amount: -15.00 },
        { category: 'Housing', amount: -185.75 }
      ]
    },
    {
      date: 'Monday, 23 March 2020',
      items: [
        { category: 'Food and Drink', amount: -156.00 },
        { category: 'Entertainment', amount: -35.20 }
      ]
    }
  ];
  protected readonly Math = Math;
  
  // Search functionality
  searchQuery: string = '';
  filteredTransactions: TransactionGroup[] = [];

  // Filter functionality
  activeFilter: 'all' | 'income' | 'expenses' = 'all';
  
  ngOnInit(): void {
    this.filteredTransactions = this.transactions;
  }
  
  ngAfterViewInit(): void {
    this.initCardAnimation();
  }
  
  initCardAnimation(): void {
    const card = this.card.nativeElement;
    
    // Add tilt class for smooth transitions
    card.classList.add('tilt');
    
    // Mouse move event for 3D tilt effect
    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate rotation based on mouse position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation values (max 10 degrees)
      const rotateY = ((x - centerX) / centerX) * 10;
      const rotateX = ((centerY - y) / centerY) * 10;
      
      // Apply the transform with GSAP
      gsap.to(card, {
        duration: 0.5,
        rotateX: rotateX,
        rotateY: rotateY,
        ease: 'power2.out'
      });
    });
    
    // Reset card position when mouse leaves
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        duration: 0.8,
        rotateX: 0,
        rotateY: 0,
        ease: 'elastic.out(1, 0.3)'
      });
    });
    
    // Initial animation
    gsap.from(card, {
      duration: 1.2,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.2
    });
  }

  // Calculate total for a transaction group
  getGroupTotal(group: TransactionGroup): number {
    return group.items.reduce((total, item) => total + item.amount, 0);
  }

  // Get CSS class for transaction category
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

  // Filter transactions based on search query
  // Add this method to your component class
  onSearchInput(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.filterTransactions();
  }

  // Set active filter
  setFilter(filter: 'all' | 'income' | 'expenses') {
    this.activeFilter = filter;
    this.filterTransactions();
  }

  // Filter transactions based on search query and active filter
  private filterTransactions() {
    this.filteredTransactions = this.transactions.filter(group => {
      const filteredItems = group.items.filter(item => {
        const matchesSearch = item.category.toLowerCase().includes(this.searchQuery);
        const matchesFilter = this.activeFilter === 'all' ||
          (this.activeFilter === 'income' && item.amount > 0) ||
          (this.activeFilter === 'expenses' && item.amount < 0);
        return matchesSearch && matchesFilter;
      });
      return filteredItems.length > 0;
    });
  }
}
