import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ObjectifService } from '../../../../../../services/saving/objectif.service';
import { MatButtonModule } from '@angular/material/button';

export interface PlanEpargneDialogData {
  objectifId: number;
  plan: any; // Le type exact dépend de la structure de votre objet PlanEpargne
}

@Component({
  selector: 'app-plan-epargne', // Gardez le sélecteur existant
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatDialogModule],
  templateUrl: './plan-epargne.component.html',
  styleUrls: ['./plan-epargne.component.css'],
})
export class PlanEpargneComponent {
  loading = false;
  error = '';
  plan: any | null = null; // Pour stocker le plan récupéré

  constructor(
    public dialogRef: MatDialogRef<PlanEpargneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlanEpargneDialogData,
    private objectifService: ObjectifService
  ) {}

  ngOnInit(): void {
    if (this.data.objectifId) {
      this.loadPlanEpargne(this.data.objectifId);
    }
  }

  loadPlanEpargne(objectifId: number): void {
    this.loading = true;
    this.error = '';
    this.objectifService.getPlanEpargne(objectifId).subscribe(
      (plan) => {
        this.loading = false;
        this.plan = plan;
      },
      (error) => {
        this.loading = false;
        this.error = 'Erreur lors de la récupération du plan d\'épargne.';
        console.error('Erreur de récupération du plan:', error);
      }
    );
  }

  onFermerClick(): void {
    this.dialogRef.close();
  }
}