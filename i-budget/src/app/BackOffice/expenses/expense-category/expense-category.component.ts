import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Importer CommonModule
import { ExpenseCategory } from '../../../Models/depenses/expense-category.model';
import { ExpenseCategoryService } from '../../../services/expense_category/expense-category.service';

@Component({
  selector: 'app-expense-category',
  templateUrl: './expense-category.component.html',
  styleUrls: ['./expense-category.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule] // Ajouter CommonModule ici
})
export class ExpenseCategoryComponent {
  newCategory: ExpenseCategory = {
    nom: '',
    description: '',
    budgetAlloue: 0
  };

  formSubmitted = false;
  budgetErreur: boolean = false;
  successMessage: string = '';
  nomErreur: boolean = false; // Ajouter une variable pour la validation du nom

  constructor(private categoryService: ExpenseCategoryService) {}

  onSubmit() {
    this.formSubmitted = true;
    this.budgetErreur = false;
    this.successMessage = '';
    this.nomErreur = false; // Réinitialiser l'erreur du nom

    // Vérification du nom (lettres et espaces seulement)
    const nomRegex = /^[a-zA-Z ]+$/;
    if (!nomRegex.test(this.newCategory.nom)) {
      this.nomErreur = true;
      return;
    }

    // Vérification du budget
    if (this.newCategory.budgetAlloue < 10) {
      this.budgetErreur = true;
      return;
    }

    // Envoi de la catégorie au service
    this.categoryService.createCategory(this.newCategory).subscribe({
      next: (res) => {
        console.log('Catégorie ajoutée avec succès', res);
        this.newCategory = { nom: '', description: '', budgetAlloue: 0 };
        this.successMessage = 'Catégorie ajoutée avec succès ✅';

        // Masquer le message après 3 secondes
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout', err);
      }
    });
  }
}
