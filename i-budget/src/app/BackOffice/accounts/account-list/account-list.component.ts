import { Component, OnInit, OnDestroy } from '@angular/core';
import { AccountService, SimCardAccount } from '../../../services/account.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor, NgStyle, DatePipe, CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, DatePipe, RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ]
})
export class AccountListComponent implements OnInit, OnDestroy {
  accounts: SimCardAccount[] | null = null;
  filteredAccounts: SimCardAccount[] | null = null;
  errorMessage: string = '';
  loading: boolean = true;
  filterForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(
    private accountService: AccountService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      searchQuery: [''],
      minBalance: [null],
      maxBalance: [null]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
    this.setupFilterListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupFilterListeners(): void {
    // Debounce search input by 300ms
    this.filterForm.get('searchQuery')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });

    // Listen to balance filter changes
    this.filterForm.get('minBalance')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300)
      )
      .subscribe(() => {
        this.applyFilters();
      });

    this.filterForm.get('maxBalance')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300)
      )
      .subscribe(() => {
        this.applyFilters();
      });
  }

  applyFilters(): void {
    if (!this.accounts) return;

    const searchQuery = this.filterForm.get('searchQuery')?.value?.toLowerCase() || '';
    const minBalance = this.filterForm.get('minBalance')?.value;
    const maxBalance = this.filterForm.get('maxBalance')?.value;

    this.filteredAccounts = this.accounts.filter(account => {
      // Search filter by account number instead of username
      const matchesSearch = searchQuery ?
        account.accountNumber?.toLowerCase().includes(searchQuery) : true;

      // Balance range filter
      const balance = account.balance;
      const aboveMinBalance = minBalance !== null && minBalance !== '' ? balance >= minBalance : true;
      const belowMaxBalance = maxBalance !== null && maxBalance !== '' ? balance <= maxBalance : true;

      return matchesSearch && aboveMinBalance && belowMaxBalance;
    });
  }

  loadAccounts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.accountService.getAllAccounts()
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe({
        next: (accounts) => {
          this.accounts = accounts;
          this.filteredAccounts = accounts; // Initialize filtered accounts with all accounts
        },
        error: (error) => {
          console.error('Error loading accounts:', error);
          this.errorMessage = 'Unable to load accounts. Please try again later.';
        }
      });
  }

  viewDetails(id: number): void {
    this.router.navigate(['accounts', 'details', id]);
  }

  clearSearchQuery(): void {
    this.filterForm.get('searchQuery')?.setValue('');
  }

  clearMinBalance(): void {
    this.filterForm.get('minBalance')?.setValue(null);
  }

  clearMaxBalance(): void {
    this.filterForm.get('maxBalance')?.setValue(null);
  }
}
