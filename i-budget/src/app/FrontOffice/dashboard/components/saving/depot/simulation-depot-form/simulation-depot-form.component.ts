// simulation-depot-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DepotService } from '../../../../../../services/saving/depot.service';
import { CompteEpargne } from '../../../../../../Models/Saving/compte-epargne.model';
import { CompteEpargneService } from '../../../../../../services/saving/compte-epargne.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simulation-depot-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './simulation-depot-form.component.html',
  styleUrls: ['./simulation-depot-form.component.css']
})
export class SimulationDepotFormComponent implements OnInit {
  simulationForm: FormGroup;
  comptesEpargne: CompteEpargne[] = [];
  resultatSimulation: number | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private depotService: DepotService,
    private compteEpargneService: CompteEpargneService
  ) {
    this.simulationForm = this.fb.group({
      compteId: [null, [Validators.required, Validators.min(1)]],
      montant: [null, [Validators.required, Validators.min(0.01)]],
      frequence: ['', Validators.required],
      dureeEnMois: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadComptesEpargne();
  }

  loadComptesEpargne(): void {
    this.compteEpargneService.getAllComptes().subscribe(comptes => {
      this.comptesEpargne = comptes;
    });
  }

  onSubmit(): void {
    if (this.simulationForm.valid) {
      this.isLoading = true;
      this.resultatSimulation = null;
      this.errorMessage = null;

      const { compteId, montant, frequence, dureeEnMois } = this.simulationForm.value;

      this.depotService.simulerDepotsRecurrents(compteId, montant, frequence, dureeEnMois).subscribe({
        next: (resultat) => {
          this.resultatSimulation = resultat;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur lors de la simulation:', err);
          this.errorMessage = err.message || 'Erreur lors de la simulation des dépôts.';
          this.isLoading = false;
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
    }
  }
}