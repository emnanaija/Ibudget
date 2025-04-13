// sim-card-account.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimCardAccountService {
  private apiUrl = 'http://localhost:8090/account'; // Update with your backend URL

  constructor(private http: HttpClient) { }

  getAllAccounts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getAccountById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createAccount(account: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, account);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  predictTransactionVolumes(simCardId: number, numFutureMonths: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${simCardId}/predictTransactionVolumes?numFutureMonths=${numFutureMonths}`);
  }

  optimizeBudget(simCardId: number, totalBudget: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${simCardId}/optimizeBudget?totalBudget=${totalBudget}`);
  }

  getTransactionsByAccountId(simCardId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${simCardId}/transactions`);
  }
}
