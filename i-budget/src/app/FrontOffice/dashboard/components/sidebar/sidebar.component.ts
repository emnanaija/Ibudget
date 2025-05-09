import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('logoutAnimation', [
      state('void', style({
        opacity: 0
      })),
      state('active', style({
        opacity: 1
      })),
      transition('void => active', animate('300ms ease-in')),
      transition('active => void', animate('300ms ease-out'))
    ])
  ]
})
export class SidebarComponent {
  @Input() isCollapsed: boolean = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private router: Router) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  showLogoutAnimation = false;
  logoutAnimationState = 'void';

  logout(): void {
    // Start animation
    this.showLogoutAnimation = true;
    this.logoutAnimationState = 'active';

    // Clear all authentication data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('scheduledTransactions_2');

    // Allow animation to play fully before redirecting
    setTimeout(() => {
      this.logoutAnimationState = 'void';
      // Redirect to login page
      this.router.navigate(['/signupRegister']);
    }, 2000); // Animation duration in milliseconds
  }
}
