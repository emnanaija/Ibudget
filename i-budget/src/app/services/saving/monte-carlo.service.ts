// monte-carlo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimulationResult } from '../../Models/Saving/simulation-result.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MonteCarloService {
  private apiUrl = 'http://localhost:8080/simulation';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }
  simulerMonteCarlo(compteId: number, dureeAnnees: number): Observable<SimulationResult> {
    const params = new HttpParams()
      .set('compteId', compteId.toString())
      .set('dureeAnnees', dureeAnnees.toString());
    return this.http.get<SimulationResult>(`${this.apiUrl}/montecarlo`, { headers: this.getAuthHeaders(), params });
  }
}