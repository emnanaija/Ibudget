import { Injectable,Inject ,PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, throwError } from 'rxjs';
import { CompteEpargne,SimCardAccount } from '../../Models/Saving/compte-epargne.model';
import { AuthService } from '../User/auth.service';
import { TauxInteret } from '../../Models/Saving/taux-interet.model';


@Injectable({
  providedIn: 'root'
})
export class CompteEpargneService {
  private apiUrl = 'http://localhost:8080/compte-epargne';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders(): HttpHeaders {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('auth_token');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }
  // CRUD Basique
  getAllComptes(): Observable<CompteEpargne[]> {
    console.log('Récupération des comptes épargne');
    return this.http.get<CompteEpargne[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des comptes:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error
        });
        return throwError(() => new Error('Erreur lors de la récupération des comptes épargne'));
      })
    );
  }

  getCompteById(id: number): Observable<CompteEpargne> {
    return this.http.get<CompteEpargne>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createCompte(compte: CompteEpargne, simCardId: number): Observable<CompteEpargne> {
    const url = `${this.apiUrl}?simCardId=${simCardId}`;
    console.log('Envoi de la requête:', { url, compte, headers: this.getAuthHeaders() });

    return this.http.post<CompteEpargne>(
      url,
      compte,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Erreur HTTP complète:', error);
        let errorMessage = 'Erreur inconnue lors de la création du compte';
        if (error.error && typeof error.error.message === 'string') {
          if (error.error.message.includes('dépasser le solde')) {
            errorMessage = 'Le solde dépasse celui de votre carte SIM';
          } else if (error.error.message.includes('Carte SIM introuvable')) {
            errorMessage = 'ID de carte SIM invalide';
          } else {
            errorMessage = error.error.message;
          }
        } else if (error.status === 401) {
          errorMessage = 'Authentification échouée : token invalide ou expiré';
        } else if (error.status === 404) {
          errorMessage = 'Ressource non trouvée';
        } else {
          console.error('Détails de l\'erreur:', {
            status: error.status,
            statusText: error.statusText,
            error: error.error
          });
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateCompte(id: number, compte: CompteEpargne): Observable<CompteEpargne> {
    return this.http.put<CompteEpargne>(
      `${this.apiUrl}/${id}`,
      compte,
      { headers: this.getAuthHeaders() }
    );
  }

  deleteCompte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Méthodes Métiers Avancées
  associerTauxInteret(compteId: number, tauxInteretId: number): Observable<CompteEpargne> {
    return this.http.put<CompteEpargne>(
      `${this.apiUrl}/${compteId}/associer-taux-interet?tauxInteretId=${tauxInteretId}`,
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  calculerMontantAvecInterets(compteId: number, dureeEnMois: number): Observable<number> {
    return this.http.get<number>(
      `${this.apiUrl}/${compteId}/calcul-interets?dureeEnMois=${dureeEnMois}`,
      { headers: this.getAuthHeaders() }
    );
  }

  genererPdfHistoriqueDepots(compteId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.apiUrl}/historique-depot/pdf?compteId=${compteId}`, {
      headers: this.getAuthHeaders(),
      observe: 'response',
      responseType: 'blob'
    });
  }

  // Méthodes utilitaires
  getUserSimCards(): Observable<SimCardAccount[]> {
    return this.http.get<SimCardAccount[]>(`${this.apiUrl}/accounts`, {
      headers: this.getAuthHeaders()
    });
  }

  getTauxInteretDisponibles(): Observable<TauxInteret[]> {
    return this.http.get<TauxInteret[]>(`${this.apiUrl}/taux-interet`, {
      headers: this.getAuthHeaders()
    });
  }
  getUserComptes(): Observable<CompteEpargne[]> {
    return this.http.get<CompteEpargne[]>(`${this.apiUrl}/user`, { headers: this.getAuthHeaders() });
  }
}