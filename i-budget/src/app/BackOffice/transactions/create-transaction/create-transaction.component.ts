import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService, SimTransaction } from '../../../services/transaction.service';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-transaction.component.html',
  styleUrls: ['./create-transaction.component.css']
})
export class CreateTransactionComponent {
  transaction: Partial<SimTransaction> = {
    amount: 0,
    transactionType: '',
    status: 'PENDING',
    refNum: '',
    descreption: '',
    transactionDate: new Date().toISOString(),
    feeAmount: 0
  };

  constructor(private transactionService: TransactionService) {}

  createTransaction(): void {
    console.log('Creating transaction:', this.transaction);
    // Implement transaction creation
  }
}