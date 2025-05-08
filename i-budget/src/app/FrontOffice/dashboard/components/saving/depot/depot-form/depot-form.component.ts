// depot-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepotService } from '../../../../../../services/saving/depot.service';
import { CompteEpargne } from '../../../../../../Models/Saving/compte-epargne.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-depot-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './depot-form.component.html',
  styleUrls: ['./depot-form.component.css']
})
export class DepotFormComponent implements OnInit {
  depotForm: FormGroup;
  comptesEpargne: CompteEpargne[] = [];
  message: string = '';
  isError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private depotService: DepotService
  ) {
    this.depotForm = this.fb.group({
      montant: [null, [Validators.required, Validators.min(0.01)]],
      dateDepot: [new Date(), Validators.required],
      frequenceDepot: ['', Validators.required],
      compteEpargneId: [null, Validators.required] // Pour lier le dépôt à un compte
    });
  }

  ngOnInit(): void {
    this.depotService.getUserComptesEpargne().subscribe(
      (comptes) => {
        this.comptesEpargne = comptes;
      },
      (error) => {
        console.error('Erreur lors de la récupération des comptes épargne', error);
      }
    );
  }

  onSubmit(): void {
    if (this.depotForm.valid && this.depotForm.value.compteEpargneId) {
      const formValue = this.depotForm.value;
      const depot = {
        montant: formValue.montant,
        dateDepot: formValue.dateDepot,
        frequenceDepot: formValue.frequenceDepot,
        compteEpargne: { id: formValue.compteEpargneId } // Envoyer uniquement l'ID
      };
      this.depotService.createDepot(depot).subscribe({
        next: (response) => {
          this.message = 'Dépôt créé avec succès.';
          this.isError = false;
          this.depotForm.reset(); // Réinitialiser le formulaire après le succès
        },
        error: (error) => {
          console.error('Erreur lors de la création du dépôt:', error);
          this.message = error.message || 'Erreur lors de la création du dépôt.';
          this.isError = true;
        }
      });
    } else {
      this.message = 'Veuillez remplir tous les champs obligatoires et sélectionner un compte épargne.';
      this.isError = true;
    }
  }
}