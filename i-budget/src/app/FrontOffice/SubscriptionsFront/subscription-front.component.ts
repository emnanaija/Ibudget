import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/User/auth.service';
import { UserService } from '../../services/user.service';
import { AnimatedBackgroundComponent } from '../dashboard/components/animated-background/animated-background.component';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { HeaderComponent } from '../dashboard/components/header/header.component';

@Component({
  selector: 'app-subscription-front',
  standalone: true,
  imports: [CommonModule, AnimatedBackgroundComponent, SidebarComponent, HeaderComponent],
  templateUrl: './subscription-front.component.html',
  styleUrls: ['./subscription-front.component.css']
})
export class SubscriptionFrontComponent implements OnInit {
  currentUserId: number | null = null;
  currentUserAccountType: string | null = null;
  currentUserRole: string | null = null;
  isLoading = false;
  message = '';
  errorMessage = '';
  isSidebarCollapsed = false;

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.currentUserId = userId;
      this.userService.getUserById(userId).subscribe((user: any) => {
        if (user) {
          this.currentUserAccountType = user.accountType;
          this.currentUserRole = user.role;
        }
      });
    } else {
      this.errorMessage = 'Unable to identify current user. Please log in again.';
    }
  }

  get isPremiumUser(): boolean {
    const isPremium = this.currentUserAccountType === 'Premium' || this.currentUserRole === 'ROLE_USER_PREMIUM' || this.currentUserRole === 'ROLE_USER_FREMIUM';
    console.log('isPremiumUser:', isPremium, 'AccountType:', this.currentUserAccountType, 'Role:', this.currentUserRole);
    return isPremium;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  paySubscription(): void {
    if (!this.currentUserId) {
      this.errorMessage = 'User session invalid. Please log in again.';
      return;
    }
    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    const subscriptionPayload = {
      amount: 10.0,
      transactionType: 'SUBSCRIPTION',
      status: 'PENDING',
      refNum: 'SUB-' + new Date().getTime(),
      descreption: 'Premium subscription payment',
      feeAmount: 0,
      sender: { userId: this.currentUserId },
      receiver: { userId: 1 },
      simCardAccount: { simCardId: this.currentUserId }
    };

    this.subscriptionService.paySubscription(subscriptionPayload).subscribe({
      next: (res) => {
        this.message = 'Subscription payment successful.';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to pay subscription: ' + (err.error?.message || err.message || 'Unknown error');
        this.isLoading = false;
      }
    });
  }

  activateSubscription(): void {
    if (!this.currentUserId) {
      this.errorMessage = 'User session invalid. Please log in again.';
      return;
    }
    if (this.isPremiumUser) {
      this.errorMessage = 'You already have a premium subscription.';
      return;
    }
    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    this.subscriptionService.activatePremiumSubscription(this.currentUserId).subscribe({
      next: (res) => {
        this.message = 'Premium subscription activated successfully.';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to activate subscription: ' + (err.error?.message || err.message || 'Unknown error');
        this.isLoading = false;
      }
    });
  }

  cancelSubscription(): void {
    if (!this.currentUserId) {
      this.errorMessage = 'User session invalid. Please log in again.';
      return;
    }
    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    this.subscriptionService.cancelPremiumSubscription(this.currentUserId).subscribe({
      next: (res) => {
        this.message = 'Premium subscription canceled successfully.';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to cancel subscription: ' + (err.error?.message || err.message || 'Unknown error');
        this.isLoading = false;
      }
    });
  }

}
