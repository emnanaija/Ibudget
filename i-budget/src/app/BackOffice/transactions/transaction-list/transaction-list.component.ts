import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimTransaction, TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: SimTransaction[] = [];
  isLoading = true;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.isLoading = false;
      }
    });
  }

  viewDetails(transaction: SimTransaction): void {
    console.log('View details for transaction:', transaction);
    // Implement view details functionality
  }

  editTransaction(transaction: SimTransaction): void {
    console.log('Edit transaction:', transaction);
    // Implement edit functionality
  }

  deleteTransaction(transaction: SimTransaction): void {
    if (confirm(`Are you sure you want to delete transaction #${transaction.idTransaction}?`)) {
      this.transactionService.deleteTransaction(transaction.idTransaction).subscribe({
        next: () => {
          this.transactions = this.transactions.filter(t => t.idTransaction !== transaction.idTransaction);
        },
        error: (error) => {
          console.error('Error deleting transaction:', error);
        }
      });
    }
  }
}