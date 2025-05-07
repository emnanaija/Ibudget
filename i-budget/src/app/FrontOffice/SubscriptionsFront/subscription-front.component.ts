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
  isPremium = false;

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
    this.loadUserStatus();
  }

  loadUserStatus(): void {
    this.errorMessage = '';
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.currentUserId = userId;
      this.userService.getUserById(userId).subscribe({
        next: (user: any) => {
          if (user) {
            this.currentUserAccountType = user.accountType;
            this.currentUserRole = user.role;

            this.isPremium = this.currentUserAccountType === 'Premium' ||
              this.currentUserRole === 'ROLE_USER_PREMIUM' ||
              this.currentUserRole === 'ROLE_USER_FREMIUM';

            console.log('isPremiumUser:', this.isPremium, 'AccountType:', this.currentUserAccountType, 'Role:', this.currentUserRole);
          }
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
          this.errorMessage = 'Failed to load user data. Please refresh the page.';
        }
      });
    } else {
      this.errorMessage = 'Unable to identify current user. Please log in again.';
    }
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  activateSubscription(): void {
    if (!this.currentUserId) {
      this.errorMessage = 'User session invalid. Please log in again.';
      return;
    }
    if (this.isPremium) {
      this.errorMessage = 'You already have a premium subscription.';
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    this.subscriptionService.activatePremiumSubscription(this.currentUserId).subscribe({
      next: (res) => {
        this.message = 'Premium subscription activated successfully!';
        this.isPremium = true; // Update status
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Activation error:', err);

        // Check if the error indicates user is already premium
        if (err.error?.message?.includes('already on Premium') ||
          err.message?.includes('already on Premium') ||
          err.error?.includes('already on Premium')) {
          // Update the UI to reflect premium status
          this.message = 'You already have a premium subscription!';
          this.isPremium = true;
          // Refresh user data from server to ensure consistent state
          this.loadUserStatus();
        } else {
          this.errorMessage = 'Failed to activate subscription: ' + (err.error?.message || err.message || 'Unknown error');
        }
        this.isLoading = false;
      }
    });
  }

  cancelSubscription(): void {
    if (!this.currentUserId) {
      this.errorMessage = 'User session invalid. Please log in again.';
      return;
    }

    if (!this.isPremium) {
      this.errorMessage = 'You do not have an active premium subscription to cancel.';
      return;
    }

    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    this.subscriptionService.cancelPremiumSubscription(this.currentUserId).subscribe({
      next: (res) => {
        this.message = 'Premium subscription canceled successfully.';
        this.isPremium = false; // Update status
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Cancellation error:', err);

        // Check if the error indicates user is not premium
        if (err.error?.message?.includes('not Premium') ||
          err.message?.includes('not Premium') ||
          err.error?.includes('not Premium')) {
          // Update the UI to reflect non-premium status
          this.message = 'Your account is already set to standard.';
          this.isPremium = false;
          // Refresh user data from server to ensure consistent state
          this.loadUserStatus();
        } else {
          this.errorMessage = 'Failed to cancel subscription: ' + (err.error?.message || err.message || 'Unknown error');
        }
        this.isLoading = false;
      }
    });
  }
}
