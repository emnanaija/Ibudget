import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepenseReccurenteService } from '../../../../services/depenses-reccurentes/depenses-reccurentes.service';
import { ExpenseCategoryService } from '../../../../services/expense_category/expense-category.service';
import { ExpenseCategory } from '../../../../Models/depenses/expense-category.model';
import { DepenseReccurente } from '../../../../Models/depenses/depense-reccurente.model';
import { SpendingWalletService, SpendingWallet } from '../../../../services/wallet/spending-wallet.service';
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
  wallets: SpendingWallet[] = [];
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  constructor(
    private fb: FormBuilder,
    private depenseService: DepenseReccurenteService,
    private categoryService: ExpenseCategoryService,
    private walletService: SpendingWalletService
  ) {
    this.depenseForm = this.fb.group({
      categorie: [null, Validators.required],
      montant: [null, [Validators.required, Validators.min(0)]],
      dateDebut: [null, Validators.required],
      frequence: [null, Validators.required],
      wallet: [null, Validators.required]  // 🆕 Ajout du champ wallet
    });
  }

  ngOnInit(): void {
    this.categoryService.getAllCategories().subscribe((data: ExpenseCategory[]) => {
      this.categories = data;
    });

    this.walletService.getAllWallets().subscribe((data: SpendingWallet[]) => {
      this.wallets = data;
    });
  }

  onSubmit(): void {
    this.depenseForm.markAllAsTouched();

    console.debug('Formulaire valide:', this.depenseForm.valid);
    console.debug('Valeurs du formulaire:', this.depenseForm.value);

    const selectedCategory = this.depenseForm.value.categorie;
    const selectedWalletId = this.depenseForm.value.wallet;

    if (this.depenseForm.valid && selectedCategory && selectedWalletId) {
      const depense: DepenseReccurente = {
        wallet: { id: selectedWalletId }, // 🆕 Utilisation de l'ID sélectionné
        categorie: selectedCategory,
        montant: this.depenseForm.value.montant,
        dateDebut: this.depenseForm.value.dateDebut,
        dateFin: '2025-12-31', // Valeur temporaire
        frequence: this.depenseForm.value.frequence
      };

      console.log('Objet dépense envoyé :', depense);

      this.depenseService.addDepense(depense).subscribe({
        next: response => {
          console.log('✅ Dépense ajoutée avec succès', response);
          this.message = '✅ Dépense ajoutée avec succès !';
          this.messageType = 'success';
          this.depenseForm.reset();
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'ajout:', error);
          this.message = error.error?.message ? `❌ ${error.error.message}` : '❌ Une erreur inconnue est survenue.';
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
