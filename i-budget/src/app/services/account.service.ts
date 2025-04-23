import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SimCardAccount {
  simCardId: number;
  accountNumber: string;
  balance: number;
  creationDate: string;
  userId: number;
  // Add other properties as needed based on your backend SimCardAccount entity
}

export interface RechargeCard {
  id: number; // Or Long if your backend sends it as a string, adjust accordingly
  code: string;
  amount: number; // Or double if your backend sends decimals
  used: boolean;
  createdAt?: string; // Optional, if it exists in the response
  updatedAt?: string; // Optional, if it exists in the response
  simCardAccount?: SimCardAccount; // Optional, depending on your needs
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiUrl}/account`;
  private rechargeUrl = `${environment.apiUrl}/recharge`; // New base URL for recharge endpoints

  constructor(private http: HttpClient) { }

  getAllAccounts(): Observable<SimCardAccount[]> {
    return this.http.get<SimCardAccount[]>(this.apiUrl);
  }

  getAccountById(id: number): Observable<SimCardAccount> {
    return this.http.get<SimCardAccount>(`${this.apiUrl}/${id}`);
  }

  createAccount(account: SimCardAccount): Observable<SimCardAccount> {
    return this.http.post<SimCardAccount>(this.apiUrl, account);
  }

  updateAccount(id: number, account: SimCardAccount): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, account);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  predictTransactionVolumes(simCardId: number, numFutureMonths: number): Observable<any> {
    const params = new HttpParams().set('numFutureMonths', numFutureMonths.toString());
    return this.http.get<any>(`${this.apiUrl}/${simCardId}/predictTransactionVolumes`, { params });
  }

  optimizeBudget(simCardId: number, totalBudget: number): Observable<number> {
    const params = new HttpParams().set('totalBudget', totalBudget.toString());
    return this.http.get<number>(`${this.apiUrl}/${simCardId}/optimizeBudget`, { params });
  }

  getTransactionsByAccountId(simCardId: number): Observable<SimCardAccount> {
    return this.http.get<SimCardAccount>(`${this.apiUrl}/${simCardId}/transactions`);
  }

  // Recharge related methods

  rechargeAccount(simCardId: number, rechargeCode: string): Observable<SimCardAccount> {
    const params = new HttpParams().set('rechargeCode', rechargeCode);
    return this.http.post<SimCardAccount>(`${this.rechargeUrl}/${simCardId}`, null, { params });
  }

  generateRechargeCards(numberOfCards: number, amount: number): Observable<RechargeCard[]> {
    const params = new HttpParams()
      .set('numberOfCards', numberOfCards.toString())
      .set('amount', amount.toString());
    return this.http.post<RechargeCard[]>(`${this.rechargeUrl}/generate`, null, { params });
  }

  rechargeAccountWithImage(simCardId: number, image: File): Observable<SimCardAccount> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http.post<SimCardAccount>(`${this.rechargeUrl}/ocr/${simCardId}`, formData);
  }

  rechargeAccountWithoutNotification(simCardId: number, rechargeCode: string): Observable<SimCardAccount> {
    const params = new HttpParams().set('rechargeCode', rechargeCode);
    return this.http.post<SimCardAccount>(`${this.rechargeUrl}/no-notification/${simCardId}`, null, { params });
  }
}
