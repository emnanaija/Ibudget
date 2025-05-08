import { Component, OnInit } from '@angular/core';
import { SpendingWalletService, SpendingWallet } from '../../../../services/wallet/spending-wallet.service';
import { CommonModule } from '@angular/common'; // Import de CommonModule pour standalone

@Component({
  selector: 'app-wallet-list',
  standalone: true,
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.css'],
  imports: [CommonModule] // Assure-toi que CommonModule est dans les imports
})
export class WalletListComponent implements OnInit {
  wallets: SpendingWallet[] = [];  // Liste des wallets
  errorMessage: string = '';  // Message d'erreur

  constructor(private walletService: SpendingWalletService) {}

  ngOnInit(): void {
    this.loadWallets();  // Charge les wallets au démarrage du composant
  }

  loadWallets(): void {
    this.walletService.getAllWallets().subscribe({
      next: (data) => {
        this.wallets = data;
        console.log(this.wallets);  // Ajoute cette ligne pour vérifier la structure des wallets
      },
      error: (err) => {
        console.error('Erreur lors du chargement des wallets', err);
        this.errorMessage = 'Erreur lors du chargement des wallets';
      }
    });
  }
  

  // Méthode pour désactiver un wallet
  onDeactivateWallet(id: number): void {
    this.walletService.deactivateWallet(id).subscribe({
      next: updatedWallet => {
        const index = this.wallets.findIndex(w => w.id === id);
        if (index !== -1) {
          // mettre à jour le wallet localement
          this.wallets[index] = updatedWallet;
        }
      },
      error: err => {
        console.error('Erreur désactivation', err);
        this.errorMessage = "Erreur lors de la désactivation du wallet.";
      }
    });
  }
  
  onactivateWallet(id: number): void {
    this.walletService.activateWallet(id).subscribe({
      next: updatedWallet => {
        const index = this.wallets.findIndex(w => w.id === id);
        if (index !== -1) {
          // mettre à jour le wallet localement
          this.wallets[index] = updatedWallet;
        }
      },
      error: err => {
        console.error('Erreur désactivation', err);
        this.errorMessage = "Erreur lors de la désactivation du wallet.";
      }
    });
  }
  
  
}
