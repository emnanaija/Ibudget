import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Objectif } from '../../Models/Saving/objectif.model';
import { CompteEpargne } from '../../Models/Saving/compte-epargne.model';
import { AuthService } from './auth.service';

export interface ApiResponse {
  message?: string;
  data?: Objectif;
}
@Injectable({
  providedIn: 'root'
})
export class ObjectifService {
  private apiUrl = 'http://localhost:8080/objectif'; // Adaptez l'URL de votre API
  private compteEpargneUrl = 'http://localhost:8080/compte-epargne'; // URL pour les comptes épargne
  private adminApiUrl='http://localhost:8080/compte-epargne/admin/comptes-epargne'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });
  }

  getAllObjectifs(): Observable<Objectif[]> {
    return this.http.get<Objectif[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getObjectifById(id: number): Observable<Objectif> {
    return this.http.get<Objectif>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
 // Nouvelle fonction pour vérifier l'alerte SANS créer l'objectif
 checkObjectifAlert(objectif: any): Observable<ApiResponse> {
  return this.http.post<ApiResponse>(`${this.apiUrl}/check-alert`, objectif, { headers: this.getAuthHeaders() });
}
 
  createObjectif(objectif: any): Observable<ApiResponse> { // Le type de 'objectif' peut être 'any' car il contient l'ID du compte
    return this.http.post<ApiResponse>(this.apiUrl, objectif, { headers: this.getAuthHeaders() });
  }

  updateObjectif(id: number, objectif: Objectif): Observable<Objectif> {
    return this.http.put<Objectif>(`${this.apiUrl}/${id}`, objectif, { headers: this.getAuthHeaders() });
  }

  deleteObjectif(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Nouvelle méthode pour récupérer les comptes épargne de l'utilisateur (similaire à DepotService)
  getUserComptesEpargne(): Observable<CompteEpargne[]> {
    const comptesEpargneUserUrl = `${this.compteEpargneUrl}/user`;
    return this.http.get<CompteEpargne[]>(comptesEpargneUserUrl, { headers: this.getAuthHeaders() });
  }

  // Méthode pour récupérer le plan d'épargne d'un objectif (selon le controller)
  getPlanEpargne(id: number): Observable<any> { // Le type 'any' car le DTO PlanEpargneDTO n'est pas défini ici
    return this.http.get<any>(`${this.apiUrl}/${id}/plan-epargne`, { headers: this.getAuthHeaders() });
  }
  // Nouvelle fonction pour récupérer TOUS les comptes (pour l'admin)
  getAllAdminComptes(): Observable<CompteEpargne[]> {
    return this.http.get<CompteEpargne[]>(this.adminApiUrl);
  }
}