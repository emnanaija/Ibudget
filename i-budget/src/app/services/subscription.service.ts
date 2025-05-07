import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private baseUrl = environment.apiUrl + '/subscription';

  constructor(private http: HttpClient) {}

  paySubscription(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/pay/${payload.sender.userId}`, payload);
  }

  activatePremiumSubscription(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/activate/${userId}`, {});
  }

  cancelPremiumSubscription(userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/cancel/${userId}`, {});
  }
}
