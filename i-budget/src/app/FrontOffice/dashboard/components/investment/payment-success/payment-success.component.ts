import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importez CommonModule

@Component({
  selector: 'app-payment-success',
  standalone: true, // Si votre composant est standalone
  imports: [CommonModule], // Ajoutez CommonModule ici
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  isProcessing: boolean = true;
  processingMessage: string = 'Processing your payment...';
  errorMessage: string = '';

  private authToken: string | null = localStorage.getItem('auth_token');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Extraire l'order_id depuis l'URL
    this.route.queryParams.subscribe(params => {
      const orderId = params['order_id'];

      if (orderId) {
        this.finalizePayment(orderId);
      } else {
        this.errorMessage = 'No order ID found in the URL';
        this.isProcessing = false;
        setTimeout(() => this.redirectToWallet(), 3000);
      }
    });
  }

  finalizePayment(orderId: string): void {
    if (!this.authToken) {
      this.errorMessage = 'Authentication token not found';
      this.isProcessing = false;
      setTimeout(() => this.redirectToWallet(), 3000);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', this.authToken);

    // Générer un payment_id aléatoire
    const randomPaymentId = 'payment_' + Math.random().toString(36).substring(2, 15);

    // Appeler l'API avec order_id et payment_id
    const apiUrl = `http://localhost:8090/api/wallet/order/deposit?order_id=${orderId}&payment_id=${randomPaymentId}`;

    this.http.put<any>(apiUrl, {}, { headers }).subscribe({
      next: (response) => {
        console.log('Payment completed successfully:', response);
        this.processingMessage = 'Payment successful! Redirecting...';
        this.isProcessing = false; // Le traitement est terminé avec succès
        setTimeout(() => this.redirectToWallet(), 2000); // Rediriger en cas de succès
      },
      error: (error) => {
        console.error('Error finalizing payment:', error);
        this.errorMessage = 'There was an error processing your payment';
        this.isProcessing = false; // Le traitement est terminé avec une erreur
        // Ne pas rediriger automatiquement en cas d'erreur.
        // Tu peux choisir d'afficher un message d'erreur plus longtemps
        // ou de proposer une action à l'utilisateur.
        // Si tu veux rediriger même en cas d'erreur, décommente la ligne suivante :
        // setTimeout(() => this.redirectToWallet(), 3000);
      }
    });
  }

  redirectToWallet(): void {
    this.router.navigate(['/wallet'], { replaceUrl: true });
  }
}