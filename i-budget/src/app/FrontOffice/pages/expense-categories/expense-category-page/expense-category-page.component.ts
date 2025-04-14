import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseCategoryComponent } from '../../../components/expense-category/expense-category.component'; // Corrige le chemin si nécessaire

@Component({
  selector: 'app-expense-category-page',
  templateUrl: './expense-category-page.component.html',
  styleUrls: ['./expense-category-page.component.css'],
  standalone: true,
  imports: [CommonModule, ExpenseCategoryComponent]  // Import de ton composant standalone
})
export class ExpenseCategoryPageComponent {}
