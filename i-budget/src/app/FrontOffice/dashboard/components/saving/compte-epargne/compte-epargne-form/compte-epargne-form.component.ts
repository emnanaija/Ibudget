import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompteEpargne } from '../../../../../../Models/Saving/compte-epargne.model';
import { CompteEpargneService } from '../../../../../../services/saving/compte-epargne.service';

@Component({
  selector: 'app-compte-epargne-form',
  templateUrl: './compte-epargne-form.component.html',
  styleUrls: ['./compte-epargne-form.component.css'],
  standalone: true,
  imports:[ReactiveFormsModule,CommonModule]
})
export class CompteEpargneFormComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private compteService: CompteEpargneService
  ) {
    this.form = this.fb.group({
      solde: [0, [Validators.required, Validators.min(0)]],
      simCardId: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { solde, simCardId } = this.form.value;

    // Créer un objet CompteEpargne
    const compteEpargne: CompteEpargne = {
      solde: solde
    };

    this.isLoading = true;
    this.errorMessage = null;

    this.compteService.createCompte(compteEpargne, simCardId).subscribe({
      next: (response) => {
        alert('Compte créé avec succès !');
        this.form.reset();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la création:', err);
        this.errorMessage = err.message || 'Erreur lors de la création du compte';
        this.isLoading = false;
      }
    });
  }
}