import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimTransaction, TransactionService } from '../../../services/transaction.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent implements OnInit {
  transactions: SimTransaction[] = [];
  filteredTransactions: SimTransaction[] = [];
  completedTransactions: SimTransaction[] = [];
  pendingTransactions: SimTransaction[] = [];
  isLoading = true;
  searchTerm = '';
  searchTerms = new Subject<string>();
  sortColumn = '';
  sortDirection = 'asc';

  constructor(private transactionService: TransactionService) {
    // Setup search with debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
      this.applyFilters();
    });
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.transactionService.getAllTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.filteredTransactions = [...data];
        this.categorizeTransactions();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading transactions:', error);
        this.isLoading = false;
      }
    });
  }

  categorizeTransactions(): void {
    this.completedTransactions = this.filteredTransactions.filter(t =>
      t.status && t.status === 'COMPLETED');
    this.pendingTransactions = this.filteredTransactions.filter(t =>
      t.status && t.status === 'PENDING');
  }

  onSearch(term: string): void {
    this.searchTerms.next(term);
  }

  applyFilters(): void {
    this.filteredTransactions = this.transactions.filter(transaction => {
      return (
        transaction.idTransaction.toString().includes(this.searchTerm) ||
        transaction.amount.toString().includes(this.searchTerm) ||
        (transaction.transactionType && transaction.transactionType.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (transaction.status && transaction.status.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (transaction.refNum && transaction.refNum.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        new Date(transaction.transactionDate).toLocaleString().toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    this.categorizeTransactions();
  }

  drop(event: CdkDragDrop<SimTransaction[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Get the transaction being moved
      const transaction = event.previousContainer.data[event.previousIndex];

      // Update the status based on the destination container
      const newStatus = event.container.id === 'completedList' ? 'COMPLETED' : 'PENDING';

      // Call the service to update the transaction status
      this.transactionService.updateTransactionStatus(transaction.idTransaction, newStatus).subscribe({
        next: () => {
          // Update the local transaction object
          transaction.status = newStatus;

          // Move the item between arrays
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        },
        error: (error) => {
          console.error('Error updating transaction status:', error);
          // You might want to show an error message to the user here
        }
      });
    }
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
          // Remove from all arrays
          this.transactions = this.transactions.filter(t => t.idTransaction !== transaction.idTransaction);
          this.filteredTransactions = this.filteredTransactions.filter(t => t.idTransaction !== transaction.idTransaction);
          this.completedTransactions = this.completedTransactions.filter(t => t.idTransaction !== transaction.idTransaction);
          this.pendingTransactions = this.pendingTransactions.filter(t => t.idTransaction !== transaction.idTransaction);
        },
        error: (error) => {
          console.error('Error deleting transaction:', error);
        }
      });
    }
  }
}
