import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimCardAccountService } from '../../services/transactions/sim-card-account.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sim-card-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './sim-card-accounts.component.html',
  styleUrls: ['./sim-card-accounts.component.css']
})
export class SimCardAccountsComponent implements OnInit {
  accounts: any[] = [];
  selectedAccount: any = null;
  predictionResults: any = null;
  optimizationResult: number | null = null;
  numFutureMonths: number = 3;
  totalBudget: number = 1000;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(private accountService: SimCardAccountService) { }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  ngOnInit(): void {
    this.loadAccounts();
  }
  loadAccounts(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.accountService.getAllAccounts().subscribe({
      next: (data) => {
        this.accounts = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.errorMessage = 'Failed to load accounts. Please try again.';
        this.isLoading = false;
      }
    });
  }

  selectAccount(account: any): void {
    this.selectedAccount = account;
    this.predictionResults = null;
    this.optimizationResult = null;
  }

  predictTransactions(): void {
    if (this.selectedAccount) {
      this.isLoading = true;
      this.accountService.predictTransactionVolumes(this.selectedAccount.id, this.numFutureMonths)
        .subscribe({
          next: (data) => {
            this.predictionResults = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Prediction error:', err);
            this.errorMessage = 'Prediction failed. Please try again.';
            this.isLoading = false;
          }
        });
    }
  }

  optimizeBudget(): void {
    if (this.selectedAccount) {
      this.isLoading = true;
      this.accountService.optimizeBudget(this.selectedAccount.id, this.totalBudget)
        .subscribe({
          next: (data) => {
            this.optimizationResult = data;
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Optimization error:', err);
            this.errorMessage = 'Budget optimization failed.';
            this.isLoading = false;
          }
        });
    }
  }

  deleteAccount(id: number): void {
    if (confirm('Are you sure you want to delete this account?')) {
      this.isLoading = true;
      this.accountService.deleteAccount(id).subscribe({
        next: () => {
          this.loadAccounts();
          this.selectedAccount = null;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.errorMessage = 'Failed to delete account.';
          this.isLoading = false;
        }
      });
    }
  }

  createNewAccount(): void {
    // You'll implement this after setting up the form
    console.log('Create new account clicked');
  }
}
