import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { gsap } from 'gsap';
import { CSSPlugin } from 'gsap/CSSPlugin';
import { Subscription, fromEvent } from 'rxjs';
import { pairwise, map, filter } from 'rxjs/operators';
import {
  AnimatedBackgroundComponent
} from '../../FrontOffice/dashboard/components/animated-background/animated-background.component';
import {BackofficeNavbarComponent} from '../BackofficeNavbarComponent/BackofficeNavbarComponent';
import {SimTransaction, TransactionService} from '../../services/transaction.service';
import {UserService} from '../../services/user.service';

gsap.registerPlugin(CSSPlugin);
@Component({
  selector: 'app-transactions-management',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AnimatedBackgroundComponent, BackofficeNavbarComponent],
  templateUrl: './transaction-management.component.html',
  styleUrl: './transaction-management.component.css'
})
export class TransactionManagementComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('header') headerRef!: ElementRef;
  @ViewChild('nav') navRef!: ElementRef;
  @ViewChild('content') contentRef!: ElementRef;

  @Input() userId: number = 0; // Input property to receive userId

  // Properties to store user and transaction data
  userData: any = null;
  transactionData: SimTransaction[] = [];
  isLoading: boolean = true;

  private routerEventsSubscription: Subscription | undefined;
  isSidebarCollapsed = false;


  constructor(
    private userService: UserService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    // Load user data if userId is provided
    if (this.userId > 0) {
      this.loadUserData();
    }

    // Load all transactions by default if no specific user is provided
    if (this.userId === 0) {
      this.loadAllTransactions();
    }
  }

  // Add this method to load all transactions
  loadAllTransactions(): void {
    this.isLoading = true;
    this.transactionService.getAllTransactions().subscribe({
      next: (transactionData) => {
        this.transactionData = transactionData;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.isLoading = false;
      }
    });
  }

  loadUserData(): void {
    this.isLoading = true;

    // Load user information
    this.userService.getUserById(this.userId).subscribe({
      next: (userData) => {
        this.userData = userData;
        this.loadTransactionData();
      },
      error: (error) => {
        console.error('Error loading user data:', error);
        this.isLoading = false;
      }
    });
  }

  loadTransactionData(): void {
    // Load transaction information based on userId
    this.transactionService.getTransactionsByUserId(this.userId).subscribe({
      next: (transactionData) => {
        this.transactionData = transactionData;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transaction data:', error);
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    // Check if we're running in a browser environment before animating
    if (typeof window !== 'undefined') {
      this.animateElements();
    }
  }

  animateElements(): void {
    // Your animation code here
    // Make sure any references to window are guarded
    if (typeof window === 'undefined') {
      return; // Exit early if not in browser environment
    }

    try {
      const header = this.headerRef.nativeElement;

      // Add null checks and default to empty arrays if elements don't exist
      const navLinks = this.navRef?.nativeElement?.querySelectorAll('a') || [];
      const separator = this.navRef?.nativeElement?.querySelectorAll('.nav-separator') || [];
      const content = this.contentRef.nativeElement;

      // Animate header
      gsap.fromTo(header, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' });

      // Only animate navLinks and separators if they exist and have length
      if (navLinks.length > 0 || separator.length > 0) {
        const elements = [...Array.from(navLinks), ...Array.from(separator)];
        if (elements.length > 0) {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'power2.out' }
          );
        }
      }

      // Animate content
      gsap.fromTo(content, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.5, ease: 'power1.in' });

      this.routerEventsSubscription = fromEvent(window, 'popstate')
        .pipe(
          map(() => window.location.pathname),
          pairwise(),
          filter(([prev, curr]) => prev.includes('transactions') && curr.includes('transactions'))
        )
        .subscribe(() => {
          gsap.fromTo(content, { opacity: 0.5, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power1.out' });
        });
    } catch (error) {
      console.error('Error in animateElements:', error);
    }
  }

  ngOnDestroy(): void {
  }
  toggleSidebar(): void {
    console.log('Toggling sidebar, current state:', this.isSidebarCollapsed);
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    console.log('New sidebar state:', this.isSidebarCollapsed);

    // Force change detection
    setTimeout(() => {
      const sidebar = document.querySelector('.sidebar');
      const mainContent = document.querySelector('.main-content');

      if (sidebar) {
        if (this.isSidebarCollapsed) {
          sidebar.classList.add('collapsed');
        } else {
          sidebar.classList.remove('collapsed');
        }
      }

      if (mainContent) {
        if (this.isSidebarCollapsed) {
          mainContent.classList.add('sidebar-collapsed');
        } else {
          mainContent.classList.remove('sidebar-collapsed');
        }
      }
    }, 0);
  }
}
