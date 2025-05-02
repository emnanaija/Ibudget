import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { AccountService, SimCardAccount } from '../../../services/account.service';

// Alternative approach without FontAwesome module
// We'll use regular CSS classes instead

@Component({
  selector: 'app-account-details',
  standalone: true,
  imports: [NgIf, DatePipe, RouterLink, CommonModule],
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent implements OnInit {
  accountId: number = 0;
  account: SimCardAccount | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = +params['id'];
      this.loadAccountDetails();
    });
  }

  loadAccountDetails(): void {
    this.isLoading = true;
    this.accountService.getAccountById(this.accountId).subscribe({
      next: (account) => {
        // Map backend properties to frontend model
        this.account = {
          ...account,
          accountNumber: `ACC-${account.simCardId.toString().padStart(6, '0')}`, // Generate account number
          creationDate: account.createdAt // Map createdAt to creationDate
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading account details:', error);
        this.errorMessage = `Failed to load account with ID ${this.accountId}.`;
        this.isLoading = false;
      }
    });
  }
}
