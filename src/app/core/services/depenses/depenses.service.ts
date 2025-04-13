import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'  // Assurez-vous que le service est fourni dans l'application entière
})
export class DepensesService {
  private apiUrl = 'http://localhost:8090/api/depenses';  // URL de l'API complète

  constructor(private http: HttpClient) { }

  getDepenses(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);  // On récupère un tableau de dépenses
  }
}
