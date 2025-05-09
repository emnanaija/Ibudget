import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { SimCardAccount } from './account.service';
import {User} from '../Models/User/user.model';

export interface Bill {
  id: number;
  amount: number;
  dueDate: string;
  description: string;
  category: string;
  status: string; // "Pending", "Paid", etc.
  simCardAccount?: SimCardAccount;
  userId: number;
  createdAt?: string;
}

export interface SimTransaction {
  id: number;
  transactionDate: string;
  amount: number;
  status: string;
  receiver: User;
  simCardAccount: SimCardAccount;
  createdAt?: string;
}

export interface Payment {
  id: number;
  amountPaid: number;
  paymentMethod: string;
  beneficiary: string;
  comment: string;
  paymentDate: string;
  paymentStatus: boolean;
  bill: Bill;
  transaction: SimTransaction;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BillPaymentService {
  private billUrl = `${environment.apiUrl}/api/bills`;
  private paymentUrl = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) { }

  // Bill related methods
  getAllBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.billUrl);
  }

  getBillById(id: number): Observable<Bill> {
    return this.http.get<Bill>(`${this.billUrl}/${id}`);
  }

  getBillsByUserId(userId: number): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.billUrl}/user/${userId}`);
  }

  getBillsByStatus(status: string): Observable<Bill[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<Bill[]>(`${this.billUrl}/status`, { params });
  }

  createBill(bill: Bill): Observable<Bill> {
    return this.http.post<Bill>(this.billUrl, bill);
  }

  updateBill(id: number, bill: Bill): Observable<void> {
    return this.http.put<void>(`${this.billUrl}/${id}`, bill);
  }

  deleteBill(id: number): Observable<void> {
    return this.http.delete<void>(`${this.billUrl}/${id}`);
  }

  // Payment related methods
  payBill(
    billId: number,
    paymentMethod: string,
    beneficiary: string,
    comment: string,
    amountPaid: number
  ): Observable<Payment> {
    const params = new HttpParams()
      .set('billId', billId.toString())
      .set('paymentMethod', paymentMethod)
      .set('beneficiary', beneficiary)
      .set('comment', comment)
      .set('amountPaid', amountPaid.toString());

    return this.http.post<Payment>(`${this.paymentUrl}/pay-bill`, null, { params });
  }

  getPaymentHistory(userId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.paymentUrl}/history/${userId}`);
  }

  getPaymentsByBillId(billId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.paymentUrl}/bill/${billId}`);
  }

  // Helper methods
  getPendingBills(): Observable<Bill[]> {
    return this.getBillsByStatus('Pending');
  }

  getUpcomingBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.billUrl}/upcoming`);
  }

  getOverdueBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(`${this.billUrl}/overdue`);
  }
}
