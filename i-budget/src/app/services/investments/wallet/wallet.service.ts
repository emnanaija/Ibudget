import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private apiUrl = 'http://localhost:8090/api/wallet'; // Assure-toi que cette URL correspond à ton backend

  constructor(private http: HttpClient) { }

  getUserWallet(): Observable<any> {
    const token = localStorage.getItem('accessToken'); // Récupère le JWT (ajuste selon ta méthode d'authentification)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(this.apiUrl, { headers });
  }
  getUserWalletByUserId(userId: number): Observable<any> {
    const token = localStorage.getItem('accessToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers });
  }
}
