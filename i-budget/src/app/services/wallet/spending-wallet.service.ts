import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SpendingWallet {
  id: number;
  solde: number;
  statut: 'ACTIF' | 'INACTIF'; // <-- c’est une string, comme la valeur retournée par ton backend
  dateOuverture: string;
}

  

@Injectable({
  providedIn: 'root'
})
export class SpendingWalletService {
  private baseUrl = 'http://localhost:8090/api/wallets';

  constructor(private http: HttpClient) {}

  // Récupérer tous les wallets
  getAllWallets(): Observable<SpendingWallet[]> {
    return this.http.get<SpendingWallet[]>(this.baseUrl);
  }

  // Créer un wallet
  createWallet(): Observable<SpendingWallet> {
    return this.http.post<SpendingWallet>(this.baseUrl, {});
  }

  // Désactiver un wallet
  deactivateWallet(id: number): Observable<SpendingWallet> {
    return this.http.put<SpendingWallet>(`${this.baseUrl}/${id}/desactivate`, {});
  }
activateWallet(id: number): Observable<SpendingWallet> {
    return this.http.put<SpendingWallet>(`${this.baseUrl}/${id}/activate`, {});
  }
}
