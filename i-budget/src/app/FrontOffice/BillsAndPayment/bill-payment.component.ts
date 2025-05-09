import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from '../../services/User/auth.service';
import { AnimatedBackgroundComponent } from '../dashboard/components/animated-background/animated-background.component';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { HeaderComponent } from '../dashboard/components/header/header.component';
import { gsap } from 'gsap';
import { TutorialComponent } from '../tutorial.component';
import { environment } from '../../../environments/environment';

interface Bill {
  id: number;
  amount: number;
  dueDate: string;
  description: string;
  category: string;
  status: string;
  userId: number;
  beneficiary: string;
  isRecurring?: boolean;
  nextDueDate?: string;
}

interface Payment {
  id: number;
  amountPaid: number;
  paymentMethod: string;
  beneficiary: string;
  comment: string;
  paymentDate: string;
  paymentStatus: boolean;
  bill: Bill;
  createdAt?: string;
}

@Component({
  selector: 'app-bill-payment',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    AnimatedBackgroundComponent, 
    SidebarComponent, 
    HeaderComponent, 
    TutorialComponent
  ],
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.css']
})
export class BillPaymentComponent implements OnInit, AfterViewInit {
  isSidebarCollapsed: boolean = false;
  currentUserId: number | null = null;
  bills: Bill[] = [];
  payments: Payment[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;
  paymentSuccessMessage: string = '';
  paymentError: string = '';
  selectedBill: Bill | null = null;
  paymentAmount: number = 0;

  @ViewChild('billListSection', { static: false }) billListSection?: ElementRef;
  @ViewChild('paymentSection', { static: false }) paymentSection?: ElementRef;
  @ViewChild('paymentAnimation', { static: false }) paymentAnimation?: ElementRef;
  @ViewChild('tutorialOverlay', { static: false }) tutorialOverlay?: ElementRef;
  isTutorialActive: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.currentUserId = userId;
      this.loadBills();
      this.loadPayments(userId);
    } else {
      this.errorMessage = 'Unable to identify current user. Please log in again.';
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getAccessToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  loadBills(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.http.get<Bill[]>(`${environment.apiUrl}/api/bills/random`, { 
      headers: this.getAuthHeaders() 
    }).subscribe({
      next: (bills) => {
        this.processBills(bills);
      },
      error: (error) => {
        this.handleBillError(error);
      }
    });
  }

  private processBills(bills: any[]): void {
    this.bills = bills.map(bill => ({
      id: bill.idBill,
      amount: bill.amount,
      dueDate: this.formatDate(bill.dueDate),
      description: `${bill.billType} Payment`,
      category: bill.billType,
      status: this.capitalizeFirstLetter(bill.status.toLowerCase()),
      userId: this.currentUserId || 0,
      beneficiary: bill.beneficiary,
      isRecurring: bill.isRecurring,
      nextDueDate: bill.nextDueDate ? this.formatDate(bill.nextDueDate) : undefined
    }));

    this.isLoading = false;
    setTimeout(() => this.animateBillPayment(), 0);
    
    const pendingBill = this.bills.find(bill => bill.status === 'Pending');
    if (pendingBill) this.selectBill(pendingBill);
  }

  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  private formatDate(dateString: any): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private handleBillError(error: any): void {
    this.isLoading = false;
    this.errorMessage = 'Failed to load bills. ';
    
    if (error.status === 401) {
      this.errorMessage += 'Please log in again.';
    } else {
      this.errorMessage += 'Please try again later.';
    }
    
    console.error('Bill error:', error);
  }

  loadPayments(userId: number): void {
    this.http.get<Payment[]>(`${environment.apiUrl}/payment/history/${userId}`, { 
      headers: this.getAuthHeaders() 
    }).subscribe({
      next: (payments) => {
        this.payments = payments.map(payment => ({
          ...payment,
          paymentDate: this.formatDate(payment.paymentDate),
          bill: {
            ...payment.bill,
            dueDate: this.formatDate(payment.bill.dueDate)
          }
        }));
      },
      error: (error) => {
        console.error('Failed to load payment history', error);
      }
    });
  }

  selectBill(bill: Bill): void {
    this.selectedBill = bill;
    this.paymentAmount = bill.amount;
  }

  makePayment(): void {
    if (!this.selectedBill || !this.paymentAmount || this.paymentAmount <= 0) {
      this.paymentError = 'Please select a bill and enter a valid amount';
      return;
    }

    this.paymentError = '';
    this.paymentSuccessMessage = '';

    const params = new HttpParams()
      .set('billId', this.selectedBill.id.toString())
      .set('paymentMethod', 'credit_card')
      .set('beneficiary', this.selectedBill.beneficiary)
      .set('comment', `Payment for ${this.selectedBill.description}`)
      .set('amountPaid', this.paymentAmount.toString());

    this.http.post<Payment>(
      `${environment.apiUrl}/payment/pay-bill`, 
      null, 
      { 
        params,
        headers: this.getAuthHeaders() 
      }
    ).subscribe({
      next: (payment) => {
        this.paymentSuccessMessage = 'Payment successful!';
        this.loadBills();
        this.loadPayments(this.currentUserId!);
        this.selectedBill = null;
        this.playPaymentSuccessAnimation();
      },
      error: (error) => {
        this.paymentError = 'Payment failed. Please try again.';
        console.error('Payment error:', error);
      }
    });
  }

  // ... (keep all your existing animation methods unchanged)
  ngAfterViewInit(): void {
    this.animateBillPayment();
  }

  animateBillPayment(): void {
    if (!this.billListSection || !this.paymentSection || !this.paymentAnimation) {
      return;
    }

    const timeline = gsap.timeline();
    timeline.from(this.billListSection.nativeElement, {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    });
    timeline.from(this.paymentSection.nativeElement, {
      duration: 0.8,
      x: 50,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.4');

    const paymentElements = this.paymentAnimation.nativeElement.querySelectorAll('.payment-element');
    paymentElements.forEach((element: HTMLElement, index: number) => {
      timeline.from(element, {
        duration: 0.5,
        y: 20,
        opacity: 0,
        ease: 'back.out(1.7)',
        delay: index * 0.1
      }, '-=0.3');
    });
  }

  playPaymentSuccessAnimation(): void {
    if (!this.paymentAnimation) return;
    const timeline = gsap.timeline();
    const checkmark = this.paymentAnimation.nativeElement.querySelector('.checkmark');
    const coins = this.paymentAnimation.nativeElement.querySelectorAll('.coin');

    gsap.set(coins, { opacity: 0, y: 0 });
    timeline.to(checkmark, { duration: 0.5, scale: 1.2, ease: 'back.out(1.7)' });
    timeline.to(checkmark, { duration: 0.3, scale: 1, ease: 'power1.out' });

    coins.forEach((coin: HTMLElement, index: number) => {
      timeline.to(coin, {
        duration: 0.8,
        opacity: 1,
        y: -50 - (index * 10),
        x: (index % 2 === 0 ? 1 : -1) * (20 + (index * 5)),
        rotation: (index % 2 === 0 ? 1 : -1) * 360,
        ease: 'power1.out',
        delay: index * 0.1
      }, '-=0.5');
    });

    timeline.to(coins, {
      duration: 0.5,
      opacity: 0,
      ease: 'power1.in',
      delay: 0.5
    });
  }

  handleTutorialToggled(isActive: boolean): void {
    this.isTutorialActive = isActive;
    if (this.tutorialOverlay?.nativeElement) {
      if (isActive) {
        gsap.to(this.tutorialOverlay.nativeElement, {
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          onStart: () => {
            this.tutorialOverlay!.nativeElement.style.pointerEvents = 'all';
          }
        });
      } else {
        gsap.to(this.tutorialOverlay.nativeElement, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            this.tutorialOverlay!.nativeElement.style.pointerEvents = 'none';
          }
        });
      }
    }
    this.highlightSection(isActive ? 'bill-list' : null);
  }

  highlightSection(sectionId: string | null): void {
    const existingHighlight = document.querySelector('.tutorial-highlight');
    if (existingHighlight) {
      existingHighlight.remove();
    }
    if (!sectionId) return;

    const section = document.querySelector(`.${sectionId}`);
    if (section) {
      const rect = section.getBoundingClientRect();
      const highlight = document.createElement('div');
      highlight.classList.add('tutorial-highlight', 'active');
      highlight.style.top = `${rect.top}px`;
      highlight.style.left = `${rect.left}px`;
      highlight.style.width = `${rect.width}px`;
      highlight.style.height = `${rect.height}px`;
      document.body.appendChild(highlight);
    }
  }
}