import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {BackofficeNavbarComponent} from '../BackofficeNavbarComponent/BackofficeNavbarComponent';
import {
  AnimatedBackgroundComponent
} from '../../FrontOffice/dashboard/components/animated-background/animated-background.component';
import {WithdrawalService} from '../../services/investments/withdrawal/withdrawal.service';
import {WalletService} from '../../services/investments/wallet/wallet.service';

interface Withdrawal {
  id: number;
  amount: number;
  status: string;
  requestDate: string;
  processedDate: string;
  user?: any;
  // ... autres propriétés
}

@Component({
  selector: 'app-investment',
  templateUrl: './investment.component.html',
  imports: [CommonModule, FormsModule, BackofficeNavbarComponent, AnimatedBackgroundComponent],
  styleUrls: ['./investment.component.css'],

})
export class InvestmentComponent implements OnInit {
  withdrawalRequests: Withdrawal[] = [];
  loadingWithdrawals = false;
  withdrawalError: string = '';

  constructor(
    private withdrawalService: WithdrawalService,
    private walletService: WalletService // Injectez WalletService
  ) {}

  ngOnInit(): void {
    this.loadWithdrawalRequests();
  }

  loadWithdrawalRequests(): void {
    this.loadingWithdrawals = true;
    this.withdrawalError = '';

    this.withdrawalService.getAllWithdrawalRequests().subscribe({
      next: (withdrawals) => {
        this.withdrawalRequests = withdrawals;
        this.loadingWithdrawals = false;
      },
      error: (error) => {
        this.withdrawalError = 'Failed to load withdrawal requests.';
        console.error('Error loading withdrawal requests:', error);
        this.loadingWithdrawals = false;
      },
    });
  }

  proceedWithdrawal(id: number, accept: boolean): void {
    this.withdrawalService.proceedWithdrawal(id, accept).subscribe({
      next: (updatedWithdrawal) => {
        // Mettez à jour la liste des demandes après le traitement
        this.withdrawalRequests = this.withdrawalRequests.map((withdrawal) =>
          withdrawal.id === id ? updatedWithdrawal : withdrawal
        );

        // Supprimez la ligne du tableau localement
        this.withdrawalRequests = this.withdrawalRequests.filter(withdrawal => withdrawal.id !== id);

        // Optionally, afficher un message de succès
        console.log(`Withdrawal request ${accept ? 'accepted' : 'rejected'} successfully.`);
      },
      error: (error) => {
        console.error('Error processing withdrawal:', error);
        // Optionally, afficher un message d'erreur
      },
    });
  }
}
