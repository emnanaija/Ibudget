// src/app/services/withdrawal.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Withdrawal } from './withdrawal'; // Assurez-vous que le chemin vers withdrawal.ts est correct

@Injectable({
  providedIn: 'root',
})
export class WithdrawalService {
  private apiUrl = 'http://localhost:8090/api/admin/withdrawal'; // L'URL de votre endpoint Spring

  constructor(private http: HttpClient) {}

  getAllWithdrawalRequests(): Observable<Withdrawal[]> {
    const token = localStorage.getItem('accessToken'); // Récupère le JWT depuis localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Withdrawal[]>(this.apiUrl, { headers });
  }

  proceedWithdrawal(id: number, accept: boolean): Observable<any> {
    const token = localStorage.getItem('accessToken'); // Récupère le JWT depuis localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const url = `${this.apiUrl}/${id}/proceed/${accept}`;
    return this.http.post(url, {}, { headers });
  }
}
