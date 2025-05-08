import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { feteRecommendation } from '../../Models/depenses/fete.model'; // Assurez-vous de définir ce modèle

@Injectable({
  providedIn: 'root'
})
export class FeteService {

  // URL de l'API backend
  private apiUrl = 'http://localhost:8090/api/fetes';

  constructor(private http: HttpClient) { }

  // Méthode pour obtenir les recommandations de fêtes
  getFetesRecommandations(): Observable<feteRecommendation[]> {
    return this.http.get<feteRecommendation[]>(`${this.apiUrl}/current`);
  }
}
