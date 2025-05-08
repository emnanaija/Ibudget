import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DepenseReccurente } from '../../Models/depenses/depense-reccurente.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class DepenseReccurenteService {
  private apiUrl = 'http://localhost:8090/api/depenses-recurrentes';  // Remplace par l'URL de ton API

  constructor(private http: HttpClient) {}

  // Récupérer toutes les dépenses récurrentes
  getAllDepenses(): Observable<DepenseReccurente[]> {
    return this.http.get<DepenseReccurente[]>(this.apiUrl);
  }

  // Récupérer une dépense récurrente par ID
  getDepenseById(id: number): Observable<DepenseReccurente> {
    return this.http.get<DepenseReccurente>(`${this.apiUrl}/${id}`);
  }

  // Ajouter une nouvelle dépense récurrente
  addDepense(depense: DepenseReccurente): Observable<DepenseReccurente> {
    return this.http.post<DepenseReccurente>(this.apiUrl, depense).pipe(
      catchError(error => {
        console.error('Erreur lors de l\'ajout de la dépense:', error);
        // Afficher plus d'informations sur l'erreur
        if (error.error) {
          console.error('Détails de l\'erreur:', error.error);
        }
        return throwError(error); // Relancer l'erreur pour que le composant puisse la gérer
      })
    );
  }
  

  // Modifier une dépense récurrente
  updateDepense(id: number, depense: DepenseReccurente): Observable<DepenseReccurente> {
    return this.http.put<DepenseReccurente>(`${this.apiUrl}/${id}`, depense);
  }

  // Supprimer une dépense récurrente
  deleteDepense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Simuler les dépenses par catégorie
  simulerDepensesParCategorie(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/simuler-depenses-categorie`);
  }

  // Récupérer le total des dépenses par catégorie
  getTotalDepensesParCategorie(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/total-depenses-categories`);
  }

  // Traiter les dépenses récurrentes
  traiterDepensesRecurrentes(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/traiter`, {});
  }

  // Obtenir les recommandations de simulation et de budget
  simulerEtObtenirRecommandations(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/simulation-et-recommandations`);
  }
  getDepenseTotalesParCategorie(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/totales-par-categorie`);
  }
  // Obtenir les prochaines dates d'exécution
  getProchainesDatesExecution(): Observable<{ [id: number]: string }> {
    return this.http.get<{ [id: number]: string }>(`${this.apiUrl}/prochaines-executions`);
  }
  

  
}
