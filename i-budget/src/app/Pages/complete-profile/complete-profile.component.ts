import { Component, OnInit } from '@angular/core';
import { RegisterRequest } from '../../Models/User/register-request';
import { UserService } from '../../services/User/user.service';
import { ActivatedRoute,Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-complete-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css'
})
export class CompleteProfileComponent implements OnInit {
  showPassword: boolean = false;

  errorMessage: string = '';
  successMessage: string = '';

  registerRequest: RegisterRequest = {
    aiTonePreference: 'FORMAL',
    dateOfBirth: new Date(),
    email: '',
    financialKnowledgeLevel: 'BEGINNER',
    firstName: '',
    gender: 'MALE',
    lastName: '',
    password: '',
    phoneNumber: '',
    profession: ''
  };
  constructor(private userService:UserService,private router:Router,private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.registerRequest.email = params['email'];
    });
  }
  /*Password strength*/
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  getPasswordStrengthClass() {
    if (!this.registerRequest.password) return '';

    const length = this.registerRequest.password.length;
    const hasUppercase = /[A-Z]/.test(this.registerRequest.password);
    const hasLowercase = /[a-z]/.test(this.registerRequest.password);
    const hasNumbers = /\d/.test(this.registerRequest.password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(this.registerRequest.password);

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
  /*v*alidate phone number*/

  isPhoneNumberValid(): boolean {
    const phoneRegex = /^\+216\d{8}$/;
    return phoneRegex.test(this.registerRequest.phoneNumber);
  }
  updatePhoneNumber(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.value.startsWith('+216')) {
        input.value = '+216'; // Ensure +216 remains at the start
      }
      this.registerRequest.phoneNumber = input.value;
    }
  /*notification*/
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
  /*complete profile*/
    completeProfile() {
      this.userService.completeProfile(this.registerRequest).subscribe({
        next: (): void => {
          this.showSuccess('Profile completed successfully');
          setTimeout(() => {
            window.location.href = 'http://localhost:8090/oauth2/authorization/google';
          }, 2000);
        },
        error: (err): void => {
          console.log(err);
          this.showError('Profile completion failed');
        }
      });
    }
    /*cancel*/
    cancel() {
      this.router.navigate(["signupRegister"]);
    }
}
