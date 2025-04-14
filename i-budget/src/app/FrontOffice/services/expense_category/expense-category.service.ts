// src/app/services/expense-category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpenseCategory } from '../../../models/depenses/expense-category.model'; // ajuste le chemin

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoryService {
  private apiUrl = 'http://localhost:8090/api/categories'; // adapte si tu as un proxy

  constructor(private http: HttpClient) {}

  // ➕ Ajouter une catégorie
  createCategory(category: ExpenseCategory): Observable<ExpenseCategory> {
    return this.http.post<ExpenseCategory>(this.apiUrl, category);
  }

  // 📝 Modifier une catégorie
  updateCategory(id: number, category: ExpenseCategory): Observable<ExpenseCategory> {
    return this.http.put<ExpenseCategory>(`${this.apiUrl}/${id}`, category);
  }

  // 🗑️ Supprimer une catégorie
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 📋 Récupérer toutes les catégories
  getAllCategories(): Observable<ExpenseCategory[]> {
    return this.http.get<ExpenseCategory[]>(this.apiUrl);
  }

  // 🔍 Obtenir une catégorie par ID
  getCategoryById(id: number): Observable<ExpenseCategory> {
    return this.http.get<ExpenseCategory>(`${this.apiUrl}/${id}`);
  }

  // 💰 Solde restant par catégorie
  getSoldeRestant(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/solde-restant`);
  }

  // 🚨 Alertes de dépassement
  getAlertesDepenses(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/alertes-depenses`);
  }
}
