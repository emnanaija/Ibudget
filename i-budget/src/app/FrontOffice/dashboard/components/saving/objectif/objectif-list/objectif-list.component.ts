// objectif-list.component.ts
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Objectif } from '../../../../../../Models/Saving/objectif.model';
import { ObjectifService } from '../../../../../../services/saving/objectif.service';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { PlanEpargne } from '../../../../../../Models/Saving/plan-epargne.model'; // Importez le modèle PlanEpargne

@Component({
  selector: 'app-objectif-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  providers: [DatePipe],
  templateUrl: './objectif-list.component.html',
  styleUrl: './objectif-list.component.css'
})
export class ObjectifListComponent implements OnInit, OnDestroy {
  objectifs: Objectif[] = [];
  loading: boolean = false;
  error: string = '';
  selectedObjectif: Objectif | null = null;
  isEditPopupVisible = false; // Renommage de la variable pour le popup de modification

  // Nouvelles propriétés pour le popup du plan d'épargne
  isPlanEpargnePopupVisible = false;
  selectedPlanEpargne: PlanEpargne | null = null;

  private ngUnsubscribe = new Subject<void>();

  constructor(
    private objectifService: ObjectifService,
    private datePipe: DatePipe,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadObjectifs();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadObjectifs(): void {
    this.loading = true;
    this.error = '';
    this.objectifService.getAllObjectifs()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (objectifs) => {
          this.objectifs = objectifs;
          this.loading = false;
        },
        (error) => {
          this.error = 'Erreur lors de la récupération des objectifs.';
          console.error('Erreur lors de la récupération des objectifs', error);
          this.loading = false;
        }
      );
  }

  deleteObjectif(id: number): void {
    if (id !== undefined && confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      this.loading = true;
      this.error = '';
      this.objectifService.deleteObjectif(id)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          () => {
            this.loadObjectifs();
          },
          (error) => {
            this.error = 'Erreur lors de la suppression de l\'objectif.';
            console.error('Erreur lors de la suppression de l\'objectif', error);
            this.loading = false;
          }
        );
    }
  }

  openEditPopup(objectif: Objectif): void { // Renommage de la fonction
    this.selectedObjectif = { ...objectif };
    this.isEditPopupVisible = true; // Afficher le popup de modification
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      const popup = document.querySelector('.edit-objectif-popup'); // Sélectionner le nouveau popup
      if (popup) {
        popup.classList.add('show');
      }
    }, 0);
  }

  closeEditPopup(): void { // Renommage de la fonction
    const popup = document.querySelector('.edit-objectif-popup'); // Sélectionner le nouveau popup
    if (popup && popup.classList.contains('show')) {
      popup.classList.remove('show');
      setTimeout(() => {
        this.isEditPopupVisible = false;
        this.selectedObjectif = null;
      }, 200);
    } else {
      this.isEditPopupVisible = false;
      this.selectedObjectif = null;
    }
  }

  saveObjectif(): void {
    if (this.selectedObjectif && this.selectedObjectif.id) {
      this.loading = true;
      this.error = '';
      this.objectifService.updateObjectif(this.selectedObjectif.id, {
        nom: this.selectedObjectif.nom,
        montantObjectif: this.selectedObjectif.montantObjectif,
        dateCreation: this.selectedObjectif.dateCreation
      } as Objectif)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(
          (updatedObjectif) => {
            const index = this.objectifs.findIndex(o => o.id === updatedObjectif.id);
            if (index !== -1) {
              this.objectifs[index] = updatedObjectif;
            }
            this.closeEditPopup(); // Fermer le popup de modification
            this.loading = false;
            // Recharger la liste après un court délai
            setTimeout(() => {
              this.loadObjectifs();
            }, 500);
          },
          (error) => {
            this.error = 'Erreur lors de la mise à jour de l\'objectif.';
            console.error('Erreur lors de la mise à jour de l\'objectif', error);
            this.loading = false;
          }
        );
    }
  }

  // Modification de la fonction pour ouvrir le popup du plan d'épargne
  openPlanEpargneModal(objectif: Objectif): void {
    this.loading = true; // Indique que nous chargeons les données du plan d'épargne
    this.error = '';
    this.selectedPlanEpargne = null; // Réinitialise le plan d'épargne sélectionné
    this.selectedObjectif = objectif; // Conserve l'objectif sélectionné
    this.isPlanEpargnePopupVisible = true;
    this.changeDetectorRef.detectChanges();

    this.objectifService.getPlanEpargne(objectif.id!) // Utilise la méthode getPlanEpargne de ObjectifService
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (planEpargne) => {
          this.selectedPlanEpargne = planEpargne;
          this.loading = false; // Le chargement est terminé

          setTimeout(() => {
            const popup = document.querySelector('.plan-epargne-popup');
            if (popup) {
              popup.classList.add('show');
            }
          }, 200);

        },
        (error) => {
          this.error = 'Erreur lors de la récupération du plan d\'épargne.';
          console.error('Erreur lors de la récupération du plan d\'épargne', error);
          this.loading = false;
          // Vous pouvez afficher un message d'erreur à l'utilisateur ici si nécessaire
        }
      );
  }

  // Fonction pour fermer le popup du plan d'épargne
  closePlanEpargnePopup(): void {
    const popup = document.querySelector('.plan-epargne-popup');
    if (popup && popup.classList.contains('show')) {
      popup.classList.remove('show');
      // Réinitialiser les variables après la transition (facultatif)
      setTimeout(() => {
        this.isPlanEpargnePopupVisible = false;
        this.selectedPlanEpargne = null;
        this.selectedObjectif = null; // Réinitialisez également l'objectif sélectionné si nécessaire
      }, 200); // Durée approximative de la transition CSS
    } else {
      this.isPlanEpargnePopupVisible = false;
      this.selectedPlanEpargne = null;
      this.selectedObjectif = null;
    }
  }
 
}