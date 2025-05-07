import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Asset {
  assetId: number;
  coin: {
    id: string;
    name: string;
    symbol: string;
    currentPrice: number;
    // ... autres propriétés de la pièce
  };
  quantity: number;
  buyPrice: number;
  // ... autres propriétés de l'actif
}

interface OptimizationResponse {
  userId: number;
  optimizedWeights: number[];
  sharpeRatio: number;
}

interface PerformanceResponse {
  monthlyMeanReturn: number;
  monthlyVolatility: number;
}

@Injectable({
  providedIn: 'root'
})
export class InvestmentService {
  private apiUrl = '/api/asset'; // Assurez-vous que cela correspond à votre backend

  constructor(private http: HttpClient) { }

  getAssets(): Observable<Asset[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Asset[]>(this.apiUrl, { headers });
  }

  getRisk(days: number): Observable<number> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<number>(`${this.apiUrl}/risk`, { headers, params });
  }

  optimizePortfolio(): Observable<OptimizationResponse> {
    const headers = this.getAuthHeaders();
    return this.http.get<OptimizationResponse>(`${this.apiUrl}/optimize`, { headers });
  }

  getPerformance(days: number): Observable<PerformanceResponse> {
    const headers = this.getAuthHeaders();
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<PerformanceResponse>(`${this.apiUrl}/performance`, { headers, params });
  }

  private getAuthHeaders(): HttpHeaders {
    const jwtToken = localStorage.getItem('accessToken'); // Récupérez votre token JWT
    if (jwtToken) {
      return new HttpHeaders({
        'Authorization': `Bearer ${jwtToken}`
      });
    }
    return new HttpHeaders();
  }
}
