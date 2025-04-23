// accounts/account-create.component.ts
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import {AccountService, SimCardAccount} from '../../services/account.service';

@Component({
  selector: 'app-account-create',
  standalone: true,
  imports: [FormsModule, RouterLink, NgIf],
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.css']
})
export class AccountCreateComponent {
  newAccount: SimCardAccount = { simCardId: 0, accountNumber: '', balance: 0, creationDate: new Date().toISOString(), userId: 0 };
  isSubmitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private accountService: AccountService, private router: Router) { }

  onSubmit(): void {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.accountService.createAccount(this.newAccount).subscribe({
      next: (response) => {
        console.log('Account created:', response);
        this.successMessage = 'Account created successfully!';
        this.isSubmitting = false;
        this.router.navigate(['/accounts']);
      },
      error: (error) => {
        console.error('Error creating account:', error);
        this.errorMessage = 'Failed to create account.';
        this.isSubmitting = false;
      }
    });
  }
}
