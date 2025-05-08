// component.ts
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ObjectifService, ApiResponse } from '../../../../../../services/saving/objectif.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompteEpargne } from '../../../../../../Models/Saving/compte-epargne.model';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-objectif-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './objectif-form.component.html',
  styleUrls: ['./objectif-form.component.css']
})
export class ObjectifFormComponent implements OnInit {
  objectifForm: FormGroup;
  comptesEpargne: CompteEpargne[] = [];
  message: string = '';
  isError: boolean = false;
  showAlertPopup: boolean = false;
  alertMessage: string = '';
  objectifToSave: any = null;
  isSubmitting: boolean = false;

  @Output() cancel = new EventEmitter<void>();
  @Output() objectifAjoute = new EventEmitter<void>();
  @Output() reload = new EventEmitter<void>(); 

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private objectifService: ObjectifService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.objectifForm = this.fb.group({
      nom: ['', Validators.required],
      montantObjectif: [null, [Validators.required, Validators.min(0.01)]],
      dateCreation: [new Date(), Validators.required],
      compteEpargneId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.objectifService.getUserComptesEpargne().subscribe(
      (comptes) => {
        this.comptesEpargne = comptes;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des comptes épargne', error);
      }
    );
  }

  onSubmit(): void {
    if (this.objectifForm.valid && this.objectifForm.value.compteEpargneId && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.objectifForm.value;
      this.objectifToSave = {
        nom: formValue.nom,
        montantObjectif: formValue.montantObjectif,
        dateCreation: formValue.dateCreation,
        compteEpargne: { id: formValue.compteEpargneId }
      };

      // Appeler le service pour vérifier l'alerte
      this.objectifService.checkObjectifAlert(this.objectifToSave).subscribe({
        next: (response: ApiResponse) => {
          this.isSubmitting = false;
          if (response.message) {
            this.alertMessage = response.message;
            this.showAlertPopup = true;
            this.changeDetectorRef.detectChanges();
          } else {
            // Pas d'alerte, créer l'objectif directement
            this.createObjectif();
          }
        },
        error: (error: any) => {
          this.isSubmitting = false;
          this.handleError('Erreur lors de la vérification de l\'alerte.');
          console.error('Erreur lors de la vérification de l\'alerte', error);
        }
      });
    }
  }

  closeAlertPopup(confirm: boolean) {
    this.showAlertPopup = false;
    if (confirm && this.objectifToSave) {
      // Si l'utilisateur confirme, créer l'objectif
      this.createObjectif();
    } else {
      // Si l'utilisateur annule, réinitialiser l'objectif
      this.objectifToSave = null;
      this.isSubmitting = false;
      this.snackBar.open('Ajout de l\'objectif annulé.', 'Fermer', {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
      });
    }
  }

  createObjectif(): void {
    if (!this.objectifToSave) return;
    this.isSubmitting = true;
    this.objectifService.createObjectif(this.objectifToSave).subscribe({
      next: (response: ApiResponse) => {
        this.isSubmitting = false;
        if (response.data) {
          this.handleSuccess();
        } else {
          this.handleError('Erreur lors de l\'ajout de l\'objectif.');
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.handleError('Erreur lors de l\'ajout de l\'objectif.');
        console.error('Erreur lors de l\'ajout de l\'objectif', error);
      }
    });
  }

  handleSuccess() {
    this.snackBar.open('Objectif ajouté avec succès!', 'Fermer', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
    this.objectifAjoute.emit();
    this.objectifForm.reset();
    this.objectifToSave = null;
    this.reload.emit();
  }

  handleError(errorMessage: string) {
    this.snackBar.open(errorMessage, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  onCancel(): void {
    this.cancel.emit();
  }
}