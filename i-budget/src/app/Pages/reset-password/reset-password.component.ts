import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/User/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetToken: string = '';
  newPassword: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.resetToken = params['token'];
      console.log('resetToken:', this.resetToken);
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrengthClass() {
    if (!this.newPassword) return '';

    const length = this.newPassword.length;
    const hasUppercase = /[A-Z]/.test(this.newPassword);
    const hasLowercase = /[a-z]/.test(this.newPassword);
    const hasNumbers = /\d/.test(this.newPassword);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(this.newPassword);

    const strength =
      (length >= 10 ? 1 : 0) +
      (hasUppercase ? 1 : 0) +
      (hasLowercase ? 1 : 0) +
      (hasNumbers ? 1 : 0) +
      (hasSpecialChars ? 1 : 0);

    if (strength <= 2) return 'strength-weak';
    if (strength <= 4) return 'strength-medium';
    return 'strength-strong';
  }

  resetPassword() {
    if (this.newPassword.length < 10) {
      this.showError('Password must be at least 10 characters long');
      return;
    }

    this.userService.resetPassword(this.newPassword, this.resetToken).subscribe({
      next: (response) => {
        console.log('Password reset successful', response);
        this.showSuccess('Password reset successful! Redirecting...');

        // Redirect after a short delay to show the success message
        setTimeout(() => {
          this.router.navigate(["signupRegister"]);
        }, 2000);
      },
      error: (error) => {
        console.error('Error resetting password', error);
        this.showError('Failed to reset password. Please try again.');
      }
    });
  }

  cancel() {
    this.router.navigate(["signupRegister"]);
  }

  showError(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  showSuccess(message: string) {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
