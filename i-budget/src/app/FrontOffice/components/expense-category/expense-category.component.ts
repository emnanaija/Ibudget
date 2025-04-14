// src/app/components/expense-category/expense-category.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ExpenseCategory } from '../../../models/depenses/expense-category.model';
import { ExpenseCategoryService } from '../../../FrontOffice/services/expense_category/expense-category.service';

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ExpenseCategoryComponent {
  newCategory: ExpenseCategory = {
    nom: '',
    description: '',
    budgetAlloue: 0
  };

  constructor(private categoryService: ExpenseCategoryService) {}

  onSubmit() {
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: (res) => {
        console.log('Catégorie ajoutée avec succès', res);
        this.newCategory = { nom: '', description: '', budgetAlloue: 0 }; // reset form
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout', err);
      }
    });
  }
  isSidebarCollapsed = false; // Propriété définie, initialisée à false par défaut

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Inverse la valeur de isSidebarCollapsed
  }
}
