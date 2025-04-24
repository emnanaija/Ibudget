import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepenseReccurenteService } from '../../../services/depenses-reccurentes/depenses-reccurentes.service';
import { ExpenseCategoryService } from '../../../services/expense_category/expense-category.service';
import { ExpenseCategory } from '../../../../models/depenses/expense-category.model';
import { DepenseReccurente } from '../../../../models/depenses/depense-reccurente.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depense-reccurente-ajout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './depense-reccurente-ajout.component.html',
  styleUrls: ['./depense-reccurente-ajout.component.css']
})
export class DepenseReccurenteAjoutComponent implements OnInit {

  depenseForm: FormGroup;
  categories: ExpenseCategory[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  constructor(
    private fb: FormBuilder,
    private depenseService: DepenseReccurenteService,
    private categoryService: ExpenseCategoryService
  ) {
    this.depenseForm = this.fb.group({
      categorie: [null, Validators.required],
      montant: [null, [Validators.required, Validators.min(0)]],
      dateDebut: [null, Validators.required],
      frequence: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((data: ExpenseCategory[]) => {
      this.categories = data;
    });
  }

  onSubmit(): void {
    this.depenseForm.markAllAsTouched(); // Pour afficher les erreurs dans le template
    
    console.debug('Formulaire valide:', this.depenseForm.valid);
    console.debug('Valeurs du formulaire:', this.depenseForm.value);
    
    const selectedCategory = this.depenseForm.value.categorie;
    
    if (this.depenseForm.valid && selectedCategory) {
      const depense: DepenseReccurente = {
        wallet: { id: 1 }, // Assure-toi que l'ID est bien passé ici
        categorie: selectedCategory,  // Catégorie complète avec ID et nom
        montant: this.depenseForm.value.montant,
        dateDebut: this.depenseForm.value.dateDebut,
        dateFin: '2025-12-31', // <-- test temporaire

        frequence: this.depenseForm.value.frequence
      };
      
      
      console.log('Objet dépense envoyé :', depense); // Vérifie ici que l'objet est bien structuré
  
      this.depenseService.addDepense(depense).subscribe({
        next: response => {
          console.log('✅ Dépense ajoutée avec succès', response);
          this.message = '✅ Dépense ajoutée avec succès !';
          this.messageType = 'success';
          this.depenseForm.reset();
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'ajout:', error);
          if (error.error) {
            console.error('🧵 Détail backend :', error.error);
            this.message = `❌ Erreur: ${error.error.message || JSON.stringify(error.error)}`;
          } else {
            this.message = '❌ Une erreur inconnue est survenue.';
          }
          this.messageType = 'error';
        }
        
      });
    } else {
      console.warn('⚠️ Formulaire invalide');
      this.message = '⚠️ Veuillez remplir tous les champs requis.';
      this.messageType = 'error';
    }
  }
  
}
