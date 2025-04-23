import { Component, OnInit } from '@angular/core';
import { AccountService, SimCardAccount } from '../../services/account.service';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor, NgStyle, DatePipe, CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [NgIf, NgFor, NgStyle, DatePipe, RouterLink, CommonModule],
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
export class AccountListComponent implements OnInit {
  accounts: SimCardAccount[] | null = null;
  errorMessage: string = '';
  loading: boolean = true;

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.loadAccounts();
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
}
