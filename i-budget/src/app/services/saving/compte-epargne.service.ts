import { Injectable,Inject ,PLATFORM_ID} from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, throwError } from 'rxjs';
import { CompteEpargne,SimCardAccount } from '../../Models/Saving/compte-epargne.model';
import { TauxInteret } from '../../Models/Saving/taux-interet.model';
import {AuthService} from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class CompteEpargneService {
  private apiUrl = 'http://localhost:8090/compte-epargne';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getAuthHeaders(): HttpHeaders {
    let token: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
      console.log('Token retrieved for API call:', token ? `${token.substring(0, 10)}...` : 'No token found');
    }

    if (!token) {
      console.warn('No authentication token available - API calls may fail with 401');
    }

    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Content-Type': 'application/json'
    });
  }

  // CRUD Basique
  getAllComptes(): Observable<CompteEpargne[]> {
    console.log('Récupération des comptes épargne');
    return this.http.get<CompteEpargne[]>(this.apiUrl, {
      headers: this.getAuthHeaders(),
      withCredentials: true // Try with credentials if your API uses cookies
    }).pipe(
      catchError(error => {
        console.error('Erreur lors de la récupération des comptes:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error
        });

        if (error.status === 401) {
          console.error('Erreur d\'authentification - vérifiez votre token');
          // You might want to redirect to login or refresh token here
        }

        return throwError(() => new Error('Erreur lors de la récupération des comptes épargne'));
      })
    );
  }

  getCompteById(id: number): Observable<CompteEpargne> {
    return this.http.get<CompteEpargne>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // In the createCompte method, update the error handling:

  createCompte(compte: CompteEpargne, simCardId: number): Observable<CompteEpargne> {
    const url = `${this.apiUrl}?simCardId=${simCardId}`;
    const headers = this.getAuthHeaders();
    console.log('Envoi de la requête:', {
      url,
      compte,
      headers: headers.keys().map(key => `${key}: ${headers.get(key)}`)
    });

    return this.http.post<CompteEpargne>(
      url,
      compte,
      { headers: headers }
    ).pipe(
      catchError(error => {
        console.error('Erreur HTTP complète:', error);
        let errorMessage = 'Erreur inconnue lors de la création du compte';

        // Log more detailed error information
        console.error('Status:', error.status);
        console.error('Status Text:', error.statusText);
        console.error('URL:', error.url);

        if (error.error) {
          console.error('Error body:', error.error);
          if (typeof error.error === 'string') {
            try {
              const parsedError = JSON.parse(error.error);
              console.error('Parsed error:', parsedError);
              errorMessage = parsedError.message || errorMessage;
            } catch (e) {
              errorMessage = error.error;
            }
          } else if (error.error.message) {
            errorMessage = error.error.message;
          }
        }

        if (error.status === 401) {
          errorMessage = 'Authentification échouée : token invalide ou expiré';
        } else if (error.status === 404) {
          errorMessage = 'Ressource non trouvée';
        } else if (error.status === 400) {
          errorMessage = 'Requête invalide: ' + errorMessage;
        } else if (error.status === 500) {
          errorMessage = 'Erreur serveur: ' + errorMessage;
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
