import { Component, OnInit } from '@angular/core';
import { ExpenseCategoryService } from '../../services/expense_category/expense-category.service';
import { ExpenseCategory } from '../../../models/depenses/expense-category.model';
import { NgIf, CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    CurrencyPipe,
    // Ajoute AsyncPipe ou DatePipe si tu les utilises dans le HTML
  ]
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
        console.log('Catégories récupérées:', data);
        this.categories = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des catégories', err);
        this.errorMessage = 'Impossible de charger les catégories';
        this.loading = false;
      }
    });
  }

  getBudgetProgress(category: ExpenseCategory): number {
    if (!category || category.budgetAlloue <= 0) {
      return 0;
    }
    const montantDepense = category.montantDepense || 0;
    const progress = (montantDepense / category.budgetAlloue) * 100;
    return Math.min(progress, 100);
  }

  getBarColor(category: ExpenseCategory): string {
    const progress = this.getBudgetProgress(category);
    if (progress < 50) {
      return 'linear-gradient(90deg, #00ff7f, #32cd32)'; // Vert
    } else if (progress < 80) {
      return 'linear-gradient(90deg, #ffa500, #ffcc00)'; // Orange
    } else {
      return 'linear-gradient(90deg, #ff4d4d, #ff0000)'; // Rouge
    }
  }
}
