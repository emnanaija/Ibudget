// depot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Depot } from '../../Models/Saving/depot.model';
import { CompteEpargne } from '../../Models/Saving/compte-epargne.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DepotService {
  private apiUrl = 'http://localhost:8080/depot'; // Adaptez l'URL de votre API
  private compteEpargneUrl = 'http://localhost:8080/compte-epargne'; // URL pour les comptes épargne

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


  getAllDepots(): Observable<Depot[]> {
    return this.http.get<Depot[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }
  getAllUserDepots(): Observable<Depot[]> {
    return this.http.get<Depot[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getDepotById(id: number): Observable<Depot> {
    return this.http.get<Depot>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createDepot(depot: any): Observable<Depot> { // Le type de 'depot' peut être 'any' car il contient l'ID du compte
    return this.http.post<Depot>(this.apiUrl, depot, { headers: this.getAuthHeaders() });
  }

  updateDepot(id: number, depot: Depot): Observable<Depot> {
    return this.http.put<Depot>(`${this.apiUrl}/${id}`, depot, { headers: this.getAuthHeaders() });
  }

  deleteDepot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  simulerDepotsRecurrents(compteId: number, montant: number, frequence: string, dureeEnMois: number): Observable<number> {
    const params = {
      compteId: compteId.toString(),
      montant: montant.toString(),
      frequence: frequence,
      dureeEnMois: dureeEnMois.toString()
    };
    return this.http.get<number>(`${this.apiUrl}/simuler`, { params: params, headers: this.getAuthHeaders() });
  }

  // Nouvelle méthode pour récupérer les comptes épargne de l'utilisateur
  getUserComptesEpargne(): Observable<CompteEpargne[]> {
    const comptesEpargneUserUrl = `${this.compteEpargneUrl}/user`;
    return this.http.get<CompteEpargne[]>(comptesEpargneUserUrl, { headers: this.getAuthHeaders() });
  }
}