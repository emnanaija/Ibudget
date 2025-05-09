import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface SimTransaction {
  idTransaction: number;
  amount: number;
  transactionType: string;
  status: string;
  refNum: string;
  descreption: string;
  transactionDate: string;
  feeAmount: number;
  simCardAccount: any;
  sender: any;
  receiver: any;
  payment: any;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transaction`;

  constructor(private http: HttpClient) { }

  getAllTransactions(): Observable<SimTransaction[]> {
    return this.http.get<SimTransaction[]>(this.apiUrl);
  }

  getTransactionsByUserId(userId: number): Observable<SimTransaction[]> {
    return this.http.get<SimTransaction[]>(`${this.apiUrl}/user/${userId}`);
  }

  getTransactionById(id: number): Observable<SimTransaction> {
    return this.http.get<SimTransaction>(`${this.apiUrl}/${id}`);
  }

  createTransaction(transaction: SimTransaction): Observable<SimTransaction> {
    return this.http.post<SimTransaction>(this.apiUrl, transaction);
  }

  updateTransaction(id: number, transaction: SimTransaction): Observable<SimTransaction> {
    return this.http.put<SimTransaction>(`${this.apiUrl}/${id}`, transaction);
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  scheduleTransaction(transaction: SimTransaction, scheduledTime: Date): Observable<SimTransaction> {
    const params = new HttpParams().set('scheduledTime', scheduledTime.toISOString());
    return this.http.post<SimTransaction>(`${this.apiUrl}/schedule`, transaction, { params });
  }

  scheduleRecurringTransaction(
    transaction: SimTransaction,
    startTime: Date,
    intervalDays: number,
    numberOfRepetitions: number
  ): Observable<SimTransaction[]> {
    const params = new HttpParams()
      .set('startTime', startTime.toISOString())
      .set('intervalDays', intervalDays.toString())
      .set('numberOfRepetitions', numberOfRepetitions.toString());
    return this.http.post<SimTransaction[]>(`${this.apiUrl}/recurring`, transaction, { params });
  }

  conditionalTransaction(transaction: SimTransaction, balanceThreshold: number): Observable<SimTransaction> {
    const params = new HttpParams().set('balanceThreshold', balanceThreshold.toString());
    return this.http.post<SimTransaction>(`${this.apiUrl}/conditional`, transaction, { params });
  }

  updateTransactionStatus(id: number, status: string): Observable<any> {
    // Using PUT instead of PATCH as it might be better supported by your backend
    // Also removing the /status suffix if your API doesn't support it
    return this.http.put<SimTransaction>(`${this.apiUrl}/${id}`, { status });
  }

  batchTransactions(transactions: SimTransaction[]): Observable<SimTransaction[]> {
    return this.http.post<SimTransaction[]>(`${this.apiUrl}/batch`, transactions);
  }

  executeScheduledTransaction(transaction: SimTransaction): Observable<any> {
      // In a real implementation, you would call your backend API
      // For now, we'll simulate a successful response
      return of({ ...transaction, status: 'COMPLETED' }).pipe(
        delay(500) // Simulate network delay
      );
    }
  
    cancelScheduledTransaction(transaction: SimTransaction): Observable<any> {
      // In a real implementation, you would call your backend API
      // For now, we'll simulate a successful response
      return of({ ...transaction, status: 'CANCELLED' }).pipe(
        delay(500) // Simulate network delay
      );
    }
}
