// calcul-interet-form.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompteEpargneService } from '../../../../../../services/saving/compte-epargne.service';

@Component({
    selector: 'app-calcul-interet-form',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './calcul-interet-form.component.html',
    styleUrls: ['./calcul-interet-form.component.css']
})
export class CalculInteretFormComponent {
    calculForm: FormGroup;
    resultatInteret: number | null = null;
    isLoading = false;
    errorMessage: string | null = null;

    constructor(private fb: FormBuilder, private compteService: CompteEpargneService) {
        this.calculForm = this.fb.group({
            compteId: [null, [Validators.required, Validators.min(1)]],
            dureeEnMois: [null, [Validators.required, Validators.min(1)]]
        });
    }

    onSubmit(): void {
        if (this.calculForm.invalid) {
            return;
        }

        this.isLoading = true;
        this.resultatInteret = null;
        this.errorMessage = null;

        const { compteId, dureeEnMois } = this.calculForm.value;

        this.compteService.calculerMontantAvecInterets(compteId, dureeEnMois).subscribe({
            next: (montantAvecInterets) => {
                this.resultatInteret = montantAvecInterets;
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Erreur lors du calcul des intérêts:', err);
                this.errorMessage = err.message || 'Erreur lors du calcul des intérêts.';
                this.isLoading = false;
            }
        });
    }
}