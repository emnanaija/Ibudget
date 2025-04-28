import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, User } from '../../../../services/user.service';
import { TransactionService } from '../../../../services/transaction.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="user-selection-container">
      <h2>Select a User</h2>
      <div class="user-list">
        <div *ngFor="let user of users"
             class="user-card"
             [class.selected]="selectedUser?.userId === user.userId"
             (click)="selectUser(user)">
          <div class="user-info">
            <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
            <span class="user-email">{{ user.email }}</span>
          </div>
          <div class="user-balance" *ngIf="user.simCardAccount">
            Balance: {{ user.simCardAccount.balance | number:'1.2-2' }} TND
          </div>
        </div>
      </div>
      <button class="view-transactions-btn"
              [disabled]="!selectedUser"
              (click)="viewTransactions()">
        View Transactions
      </button>
    </div>
  `,
  styles: [`
    .user-selection-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h2 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }

    .user-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .user-card {
      padding: 1rem;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .user-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .user-card.selected {
      border-color: #2196f3;
      background-color: rgba(33, 150, 243, 0.05);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .user-name {
      font-weight: 600;
      color: #333;
    }

    .user-email {
      font-size: 0.9rem;
      color: #666;
    }

    .user-balance {
      margin-top: 0.5rem;
      font-weight: 500;
      color: #4caf50;
    }

    .view-transactions-btn {
      display: block;
      width: 100%;
      padding: 1rem;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .view-transactions-btn:disabled {
      background: #e0e0e0;
      cursor: not-allowed;
    }

    .view-transactions-btn:not(:disabled):hover {
      background: #1976d2;
    }

    @media (max-width: 768px) {
      .user-selection-container {
        padding: 1rem;
      }

      .user-list {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class UserSelectionComponent implements OnInit {
  users: User[] = [];
  selectedUser: User | null = null;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  selectUser(user: User): void {
    this.selectedUser = user;
  }

  viewTransactions(): void {
    if (this.selectedUser) {
      this.router.navigate(['/transactions', this.selectedUser.userId]);
    }
  }
}
