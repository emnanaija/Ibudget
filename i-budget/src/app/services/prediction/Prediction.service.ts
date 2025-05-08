import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {

  private apiUrl = 'http://localhost:8090/api/predictions/predict'; // URL de ton API Spring

  constructor(private http: HttpClient) { }

  // Méthode pour envoyer une requête POST avec les données
  predictCategory(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
