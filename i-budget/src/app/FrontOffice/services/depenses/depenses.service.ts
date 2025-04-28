import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Depense,Category,Wallet } from '../../../models/depenses/depense.model';  // Adapte le chemin si besoin

@Injectable({
  providedIn: 'root'
})
export class DepensesService {
  private apiUrl = 'http://localhost:8090/api/depenses';

  constructor(private http: HttpClient) {}

  // ✅ GET: Toutes les dépenses
  getDepenses(): Observable<Depense[]> {
    return this.http.get<Depense[]>(this.apiUrl);
  }

  // ✅ GET: Une dépense par ID
  getDepenseById(id: number): Observable<Depense> {
    return this.http.get<Depense>(`${this.apiUrl}/${id}`);
  }

  // ✅ GET: Dépenses par wallet ID
  getDepensesByWalletId(walletId: number): Observable<Depense[]> {
    return this.http.get<Depense[]>(`${this.apiUrl}/wallet/${walletId}`);
  }

  // ✅ GET: Dépenses par mois + année
  getDepensesByWalletAndMonth(walletId: number, mois: number, annee: number): Observable<Depense[]> {
    return this.http.get<Depense[]>(`${this.apiUrl}/wallet/${walletId}/mois/${mois}/annee/${annee}`);
  }

  // ✅ POST: Créer une dépense manuellement
  createDepense(depense: Depense): Observable<Depense> {
    console.log('Données reçues dans le service createDepense:', depense);  // Vérifie l'objet depense avant envoi
    return this.http.post<Depense>(`${this.apiUrl}/ajoutManuel`, depense);
  }
  

  // ✅ PUT: Mettre à jour une dépense
  updateDepense(id: number, depense: Depense): Observable<Depense> {
    return this.http.put<Depense>(`${this.apiUrl}/${id}`, depense);
  }

  // ✅ DELETE: Supprimer une dépense
  deleteDepense(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ✅ POST: Upload d’une image de dépense
  uploadDepenseImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload`, formData, { responseType: 'text' });
  }

  // ✅ GET: Exporter les dépenses en Excel
  exportDepensesExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-excel`, { responseType: 'blob' });
  }
  isCategoryObject(category: Category | number | undefined): category is Category {
    return category !== undefined && typeof category !== 'number' && 'nom' in category;
  }
 
}
