// depot-list.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Depot } from '../../../../../../Models/Saving/depot.model';
import { DepotService } from '../../../../../../services/saving/depot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule pour le formulaire
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-depot-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './depot-list.component.html',
  styleUrls: ['./depot-list.component.css']
})
export class DepotListComponent implements OnInit {
  depots: Depot[] = [];
  loading: boolean = false;
  error: string = '';
  selectedDepot: Depot | null = null; // Pour stocker le dépôt à modifier
  isEditPopupVisible = false; // Pour contrôler l'affichage du popup de modification

  constructor(private depotService: DepotService, private datePipe: DatePipe, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadDepots();
  }

  loadDepots(): void {
    this.loading = true;
    this.error = '';
    this.depotService.getAllUserDepots().subscribe(
      (depots) => {
        this.depots = depots;
        this.loading = false;
      },
      (error) => {
        this.error = 'Erreur lors de la récupération des dépôts.';
        console.error('Erreur lors de la récupération des dépôts', error);
        this.loading = false;
      }
    );
  }

  deleteDepot(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dépôt ?')) {
      this.loading = true;
      this.error = '';
      this.depotService.deleteDepot(id).subscribe(
        () => {
          this.loadDepots(); // Recharger la liste après la suppression
        },
        (error) => {
          this.error = 'Erreur lors de la suppression du dépôt.';
          console.error('Erreur lors de la suppression du dépôt', error);
          this.loading = false;
        }
      );
    }
  }

  openEditPopup(depot: Depot): void {
    this.selectedDepot = { ...depot };
    this.isEditPopupVisible = true;
    this.calculateProchainDepot();
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      const popup = document.querySelector('.edit-depot-popup');
      if (popup) {
        popup.classList.add('show');
      }
    }, 0);
  }

  closeEditPopup(): void {
    const popup = document.querySelector('.edit-depot-popup');
    if (popup && popup.classList.contains('show')) {
      popup.classList.remove('show');
      setTimeout(() => {
        this.isEditPopupVisible = false;
        this.selectedDepot = null;
      }, 200);
    } else {
      this.isEditPopupVisible = false;
      this.selectedDepot = null;
    }
  }

  calculateProchainDepot(): void {
    if (this.selectedDepot && this.selectedDepot.dateDepot && this.selectedDepot.frequenceDepot) {
      const currentDate = new Date(this.selectedDepot.dateDepot);
      let prochainDate: Date | null = null;;

      switch (this.selectedDepot.frequenceDepot) {
        case 'mensuel':
          prochainDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
          break;
        case 'trimestriel':
          prochainDate = new Date(currentDate.setMonth(currentDate.getMonth() + 3));
          break;
        case 'annuel':
          prochainDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
          break;
      }
      this.selectedDepot.prochainDepot = prochainDate ? this.datePipe.transform(prochainDate, 'yyyy-MM-dd') : null;
    } else {
      this.selectedDepot!.prochainDepot = null;
    }
  }

  saveDepot(): void {
    if (this.selectedDepot) {
      this.loading = true;
      this.error = '';
      this.depotService
        .updateDepot(this.selectedDepot.id!, {
          montant: this.selectedDepot.montant,
          dateDepot: this.selectedDepot.dateDepot,
          frequenceDepot: this.selectedDepot.frequenceDepot,
          prochainDepot: this.selectedDepot.prochainDepot
        } as Depot)
        .subscribe(
          (updatedDepot) => {
            const index = this.depots.findIndex(d => d.id === updatedDepot.id);
            if (index !== -1) {
              this.depots[index] = updatedDepot;
            }
            this.loadDepots(); // Recharger la liste pour refléter les changements
            this.closeEditPopup();
          },
          (error) => {
            this.error = 'Erreur lors de la mise à jour du dépôt.';
            console.error('Erreur lors de la mise à jour du dépôt', error);
            this.loading = false;
          }
        );
    }
  }
}