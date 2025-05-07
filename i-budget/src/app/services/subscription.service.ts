import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private baseUrl = 'http://localhost:8090/subscription';

  constructor(private http: HttpClient) {}

  // Update to expect a response as an object
  activatePremiumSubscription(userId: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.baseUrl}/activate/${userId}`, {}, { headers });
  }

  // You may need similar updates for other methods like cancelSubscription and paySubscription
  cancelPremiumSubscription(userId: number): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.baseUrl}/cancel/${userId}`, {}, { headers });
  }

  paySubscription(subscriptionPayload: any): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.baseUrl}/pay/${subscriptionPayload.sender.userId}`, subscriptionPayload, { headers });
  }
}
