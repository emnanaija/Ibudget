import { Component, OnInit } from '@angular/core';
import { ExpenseCategoryService } from '../../services/expense_category/expense-category.service';
import { ExpenseCategory } from '../../../models/depenses/expense-category.model';
import { NgIf, AsyncPipe,CommonModule, CurrencyPipe, DatePipe } from '@angular/common'; // ✅ Ajout ici

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  standalone: true, // Ajoute cette ligne

  imports: [CommonModule,
    NgIf,
    AsyncPipe,
    CurrencyPipe,
    DatePipe]
})
export class CategoryListComponent implements OnInit {
  categories: ExpenseCategory[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private categoryService: ExpenseCategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        console.log('Catégories récupérées:', data); // Vérifie les données ici
        this.categories = data; // Assure-toi que 'data' est un tableau d'objets de catégorie
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des catégories', err);
        this.errorMessage = 'Impossible de charger les catégories';
        this.loading = false;
      }
    });
  }
  getBudgetProgress(category: any): number {
    if (!category.budgetAlloue || category.budgetAlloue === 0) return 0;
    const progress = (category.montantDepense || 0) / category.budgetAlloue * 100;
    return Math.min(progress, 100); // Ne dépasse pas 100%
  }
  
}
