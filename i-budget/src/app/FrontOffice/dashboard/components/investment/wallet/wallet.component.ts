import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header.component';
import { WalletService } from '../../../../../services/investments/wallet/wallet.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Withdrawal } from '../../../../../services/investments/withdrawal/withdrawal';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit {
  @Input() wallet: any;
  @Input() walletError: string = '';
  @Output() close = new EventEmitter<void>();

  isSidebarCollapsed = false;
  isLoading: boolean = false;
  authToken: string | null = localStorage.getItem('accessToken');
  isAddMoneyPopupVisible: boolean = false;
  addAmount: number | null = null;
  isPaymentFinalizing: boolean = false;
  finalizationError: string = '';
  // Status message for payment processing
  paymentStatusMessage: string = '';
  showPaymentStatus: boolean = false;

    // Propriétés pour la liste des ordres
    orders: any[] = [];
    ordersLoading: boolean = false;
    ordersError: string = '';

    isTransferPopupVisible: boolean = false;
    transferAmount: number | null = null; // Pour stocker le montant à transférer
    recipientWalletId: number | null = null; // Pour stocker l'ID du wallet destinataire
    transferSuccessMessage: string = ''; // Nouvelle variable pour le message de succès
    transferErrorMessage: string = ''; // Optionnel: pour un message d'erreur spécifique*

    isWithdrawalPopupVisible: boolean = false;
    withdrawalAmount: number | null = null;
    bankName: string = ''; // Nouvelle variable
    holderName: string = ''; // Nouvelle variable
    accountNumber: string = ''; // Nouvelle variable
    withdrawalSuccessMessage: string = '';
    withdrawalErrorMessage: string = '';


    withdrawals: Withdrawal[] = [];
    withdrawalsLoading: boolean = false;
    withdrawalsError: string = '';
  constructor(
    private walletService: WalletService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log('Wallet component initialized.');

    // Vérifie s'il y a un order_id dans l'URL au retour de Stripe
    this.route.queryParams.subscribe(params => {
      const orderId = params['order_id'];
      if (orderId && this.authToken) {
        console.log('Payment successful, detected order_id:', orderId);
        this.showPaymentStatus = true;
        this.paymentStatusMessage = 'Processing your payment...';

        // Finalisation automatique
        this.finalizePayment(orderId);

        // Supprime les paramètres de l'URL sans recharger la page
        this.router.navigate(['/wallet'], {
          replaceUrl: true,
          queryParams: {}
        });
      } else {
        this.loadWalletData(); // Charger les données initialement et si pas d'orderId
        this.loadUserOrders();
        this.loadWithdrawalHistory();
      }
    });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  loadWalletData(): void {
    this.isLoading = true;
    this.walletError = '';
    this.walletService.getUserWallet().subscribe({
      next: (data) => {
        this.wallet = data;
        this.walletError = '';
        this.isLoading = false;
        console.log('Wallet data loaded:', this.wallet);
      },
      error: (error) => {
        this.walletError = 'Failed to load wallet information.';
        this.wallet = null;
        this.isLoading = false;
        console.error('Error loading wallet data:', error);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  openAddMoneyPopup(): void {
    this.isAddMoneyPopupVisible = true;
    this.addAmount = null;
  }

  closeAddMoneyPopup(): void {
    this.isAddMoneyPopupVisible = false;
    this.finalizationError = '';
  }

  confirmAddMoney(): void {
    if (this.addAmount !== null && this.addAmount > 0) {
      const paymentMethod = 'STRIPE';
      const amount = this.addAmount;
      if (this.authToken) {
        const headers = new HttpHeaders().set('Authorization', this.authToken);
        this.http.post<any>(`http://localhost:8090/api/payment/${paymentMethod}/amount/${amount}`, {}, { headers }).subscribe({
          next: (response) => {
            console.log('Payment initiated:', response);
            if (response.payment_url) {
              window.location.href = response.payment_url;
            } else {
              alert('Payment initiated but no redirect URL received.');
              this.loadWalletData();
            }
          },
          error: (error) => {
            this.walletError = 'Failed to initiate payment.';
            console.error('Error initiating payment:', error);
          }
        });
        this.closeAddMoneyPopup();
      } else {
        this.walletError = 'Authentication token not found.';
      }
    } else {
      alert('Please enter a valid amount.');
    }
  }

  finalizePayment(orderId: string): void {
    if (!this.authToken) {
      console.error('Authentication token not found.');
      this.paymentStatusMessage = 'Error: Authentication token not found';
      this.isPaymentFinalizing = false;
      setTimeout(() => {
        this.showPaymentStatus = false;
      }, 3000);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', this.authToken);

    // Générer un payment_id unique et aléatoire
    const randomPaymentId = 'payment_' + Math.random().toString(36).substring(2, 15);

    // Construire l'URL avec order_id et payment_id
    const apiUrl = `http://localhost:8090/api/wallet/order/deposit?order_id=${orderId}&payment_id=${randomPaymentId}`;

    console.log('Finalizing payment with URL:', apiUrl);

    // Appel à l'API pour finaliser le paiement
    this.http.put<any>(apiUrl, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Deposit finalized successfully:', response);
        this.paymentStatusMessage = 'Payment completed successfully!';

        this.loadWalletData(); // Recharger les données du wallet après succès

        this.isPaymentFinalizing = false;

        setTimeout(() => {
          this.showPaymentStatus = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error finalizing deposit:', error);
        this.paymentStatusMessage = 'Failed to complete payment. Please contact support.';
        this.finalizationError = 'Failed to finalize deposit.';
        this.isPaymentFinalizing = false;
        this.loadWalletData(); // Tentative de recharger même en cas d'erreur
        setTimeout(() => {
          this.showPaymentStatus = false;
        }, 5000);
      }
    });
  }
  loadUserOrders(): void {
    this.ordersLoading = true;
    this.ordersError = '';

    if (this.authToken) {
      const headers = new HttpHeaders().set('Authorization', this.authToken);
      this.http.get<any[]>('http://localhost:8090/order', { headers }).subscribe({
        next: (data) => {
          this.orders = data;
          this.ordersLoading = false;
          // Ajouter la classe 'loaded' pour l'animation
          const ordersContainer = document.querySelector('.user-orders-container');
          if (ordersContainer) {
            ordersContainer.classList.add('loaded');
          }
          console.log('User orders loaded:', this.orders);
        },
        error: (error) => {
          this.ordersError = 'Failed to load user orders.';
          this.ordersLoading = false;
          const ordersContainer = document.querySelector('.user-orders-container');
          if (ordersContainer) {
            ordersContainer.classList.add('loaded'); // Ajouter 'loaded' même en cas d'erreur pour afficher (sans l'animation d'apparition réussie)
          }
          console.error('Error loading user orders:', error);
        }
      });
    } else {
      this.ordersError = 'Authentication token not found.';
      this.ordersLoading = false;
      const ordersContainer = document.querySelector('.user-orders-container');
      if (ordersContainer) {
        ordersContainer.classList.add('loaded');
      }
    }
  }


  openTransferPopup() {
    this.isTransferPopupVisible = true;
    this.transferAmount = null;
    this.recipientWalletId = null;
    this.transferSuccessMessage = ''; // Réinitialiser le message de succès
    this.transferErrorMessage = ''; // Réinitialiser le message d'erreur
  }

  closeTransferPopup() {
    this.isTransferPopupVisible = false;
    this.transferSuccessMessage = ''; // Réinitialiser le message lors de la fermeture
    this.transferErrorMessage = ''; // Réinitialiser le message lors de la fermeture
  }

  confirmTransfer() {
    if (this.transferAmount !== null && this.recipientWalletId !== null) {
      const transferData = {
        amount: this.transferAmount
      };
      const jwtToken = localStorage.getItem('accessToken');

      if (jwtToken) {
        this.http.put(
          `http://localhost:8090/api/wallet/${this.recipientWalletId}/transfer`,
          transferData,
          { headers: { 'Authorization': `Bearer ${jwtToken}` } }
        ).subscribe(
          (response) => {
            console.log('Transfer successful:', response);
            this.transferSuccessMessage = 'Transfer successful!'; // Afficher le message de succès
            this.transferErrorMessage = ''; // Effacer tout message d'erreur précédent
            // Optionnel: fermer la pop-up après un délai
            setTimeout(() => {
              this.closeTransferPopup();
              // Ici, vous pouvez rafraîchir les informations du wallet si nécessaire
            }, 1500); // Fermer après 1.5 secondes
          },
          (error) => {
            console.error('Transfer failed:', error);
            this.transferErrorMessage = 'Transfer failed. Please try again.'; // Afficher un message d'erreur
            this.transferSuccessMessage = ''; // Effacer tout message de succès précédent
            // Gérer l'erreur plus en détail si nécessaire
          }
        );
      } else {
        console.error('JWT token not found.');
        this.transferErrorMessage = 'Authentication error. Please log in again.';
        this.transferSuccessMessage = '';
      }
    } else {
      console.warn('Please enter the transfer amount and recipient wallet ID.');
      this.transferErrorMessage = 'Please enter the amount and recipient ID.';
      this.transferSuccessMessage = '';
    }
  }


  openWithdrawalPopup() {
    this.isWithdrawalPopupVisible = true;
    this.withdrawalAmount = null;
    this.bankName = ''; // Réinitialiser les champs
    this.holderName = '';
    this.accountNumber = '';
    this.withdrawalSuccessMessage = '';
    this.withdrawalErrorMessage = '';
  }

  closeWithdrawalPopup() {
    this.isWithdrawalPopupVisible = false;
    this.withdrawalAmount = null;
    this.bankName = ''; // Réinitialiser les champs
    this.holderName = '';
    this.accountNumber = '';
    this.withdrawalSuccessMessage = '';
    this.withdrawalErrorMessage = '';
  }

  confirmWithdrawal() {
    if (this.withdrawalAmount !== null && this.withdrawalAmount > 0 && this.bankName && this.holderName && this.accountNumber) {
      const amount = this.withdrawalAmount;
      const bankName = this.bankName;
      const holderName = this.holderName;
      const accountNumber = this.accountNumber;
      const jwtToken = localStorage.getItem('accessToken');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${jwtToken}`
      });

      const withdrawalData = { // Créez un objet pour envoyer les données supplémentaires
        bankName: bankName,
        holderNameAccount: holderName,
        accountNumber: accountNumber
      };

      this.http.post(`http://localhost:8090/api/withdrawal/${amount}`, withdrawalData, { headers }).subscribe(
        (response) => {
          console.log('Withdrawal request successful:', response);
          this.withdrawalSuccessMessage = 'Withdrawal request submitted successfully.';
          this.withdrawalErrorMessage = '';
          setTimeout(() => {
            this.closeWithdrawalPopup();
            this.loadWithdrawalHistory();
          }, 1500);
        },
        (error) => {
          console.error('Withdrawal request failed:', error);
          this.withdrawalErrorMessage = 'Withdrawal request failed. Please try again.';
          this.withdrawalSuccessMessage = '';
        }
      );
    } else {
      this.withdrawalErrorMessage = 'Please fill in all withdrawal details.';
      this.withdrawalSuccessMessage = '';
    }
  }
  loadWithdrawalHistory() {
    this.withdrawalsLoading = true;
    this.withdrawalsError = '';
    const jwtToken = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });

    this.http.get<Withdrawal[]>('http://localhost:8090/api/withdrawal', { headers }).subscribe(
      (data) => {
        this.withdrawals = data;
        this.withdrawalsLoading = false;
      },
      (error) => {
        console.error('Error loading withdrawal history:', error);
        this.withdrawalsError = 'Failed to load withdrawal history.';
        this.withdrawalsLoading = false;
      }
    );
  }
}
