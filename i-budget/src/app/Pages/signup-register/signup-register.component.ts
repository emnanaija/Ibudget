import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationRequest } from '../../Models/User/authentication-request';
import { RegisterRequest } from '../../Models/User/register-request';
import { UserService } from '../../services/User/user.service';


interface aiTone {
  name: string;
}

@Component({
  selector: 'app-signup-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup-register.component.html',
  styleUrl: './signup-register.component.css'
})
export class SignupRegisterComponent implements OnInit {
  isActive: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  successMessage: string = '';
  errorMsgSignIn: Array<string> = [];
  errorMsgSignUp: Array<string> = [];
  emailError = '';
  authRequest: AuthenticationRequest = { email: '', password: '' };
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
  aiTones: aiTone[] | undefined;
  loading = false;
  emailSent = false;
  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.aiTones = [
      { name: 'FORMAL' },
      { name: 'INFORMAL' },
      { name: 'FRIENDLY' }
    ];
    console.log('role!!!!!', localStorage.getItem('role'));
  }

  toggleForm(): void {
    this.isActive = !this.isActive;
  }
/**Notification */
showSuccess(message: string) {
  this.successMessage = message;
  setTimeout(() => {
    this.successMessage = '';
  }, 3000);
}
  showError(mess: string) {
    this.errorMessage = mess;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
/*Password visibility*/
togglePasswordVisibility() {
  this.showPassword = !this.showPassword;
}

getPasswordStrengthClass() {
  if (!this.registerRequest.password ) return '';

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

  //***********************/
  signIn(): void {
    // Clear previous error messages
    this.errorMsgSignIn = [];

    // Validate input fields
    if (!this.authRequest.email) {

      return;
    }
    if (!this.authRequest.password) {

      return;
    }

    // Call the login service and handle the response asynchronously
    this.userService.login(this.authRequest.email, this.authRequest.password).subscribe({
      next: (res): void => {

          // Store tokens and navigate to the next page
          localStorage.setItem('accessToken', res.accessToken);
          localStorage.setItem('refreshToken', res.refreshToken);
          localStorage.setItem('role', res.role);
          localStorage.setItem('userId', res.id);
          localStorage.setItem('email', res.email);
          if(res.role=='ROLE_ADMIN'){
            this.router.navigate(["dashboard"]); //Rayen dashboard Admin
          }else{
            this.router.navigate(["dashboardfront"]); // Rayen ashboard user
          }


      },
      error: (err): void => {
        console.log(err);  // Log the error for debugging purposes
        this.showError(err.error.error); // Show a user-friendly error
      }
    });
  }

  signUp(): void {
    this.errorMsgSignUp= [];
      this.userService.register(
        this.registerRequest
      )
        .subscribe({
          next: (): void => {
            this.router.navigate(['activateAccount']);
          },
          error: (err) : void => {
            console.log(err);
            this.showError(err.error);
          }
        });
  }

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

  /*send reset password*/
   /*send reset password*/
   sendResetPasswordEmail(event: Event): void {
    if (this.authRequest.email==='') {
      this.showError("Email is required");
    }else{
    event.preventDefault();
    this.loading = true;
    this.emailSent = false; // Reset the sent state

    // Show "Sending..." for 1 second
    setTimeout(() => {
      this.loading = false;
      this.emailSent = true; // Change to "Sent!"

      // Show "Sent!" for 2 seconds
      setTimeout(() => {
        this.emailSent = false; // Change back to "Forgot your password?"
      }, 2000);

      // Make the actual API call in the background
      this.userService.sendResetPasswordEmail(
        this.authRequest.email
      )
        .subscribe({
          next: (): void => {
            console.log("Email sent!");
            // We don't update UI here as it's handled by the timeouts
          },
          error: (err) : void => {
            console.log(err);
            // We still log the error but don't show it to the user
            // as we're showing a predetermined sequence of states
          }
        });
    }, 1000);
  }}
  validateEmail(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = this.registerRequest.email || '';
    const isValid = emailRegex.test(email);

    if (!isValid && email) {
      this.emailError = 'Please enter a valid email address';
    } else {
      this.emailError = '';
    }

    return isValid || !email; // Return true if empty (not required)
  }
}
