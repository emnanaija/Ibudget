import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CompteEpargne } from '../../../../../../Models/Saving/compte-epargne.model';
import { CompteEpargneService } from '../../../../../../services/saving/compte-epargne.service';
import { CommonModule, NgIf } from '@angular/common';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-compte-epargne-list',
  templateUrl: './compte-epargne-list.component.html',
  styleUrls: ['./compte-epargne-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf
  ]
})
export class CompteEpargneListComponent implements OnInit {
  comptes: CompteEpargne[] = [];
  loading = true;
  error = '';
  selectedCompte: CompteEpargne | null = null; // Pour stocker le compte à afficher dans le popup
  isDetailsPopupVisible = false; // Pour contrôler l'affichage du popup

  constructor(private compteService: CompteEpargneService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadComptes();
  }

  loadComptes(): void {
    this.compteService.getAllComptes().subscribe({
      next: (data) => {
        this.comptes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des comptes:', err);
        this.error = 'Erreur lors du chargement des comptes épargne.';
        this.loading = false;
      }
    });
  }
  openDetailsPopup(compte: CompteEpargne): void {
    this.selectedCompte = compte;
    this.isDetailsPopupVisible = true;
    this.changeDetectorRef.detectChanges();
    setTimeout(() => {
      const popup = document.querySelector('.compte-details-popup');
      if (popup) {
        popup.classList.add('show');
      }
    }, 0);
  }

  closeDetailsPopup(): void {
    const popup = document.querySelector('.compte-details-popup');
    if (popup && popup.classList.contains('show')) {
      popup.classList.remove('show');
      setTimeout(() => {
        this.isDetailsPopupVisible = false;
        this.selectedCompte = null;
      }, 200);
    } else {
      this.isDetailsPopupVisible = false;
      this.selectedCompte = null;
    }
  }

  deleteCompte(compteId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte épargne ?')) {
      this.compteService.deleteCompte(compteId).subscribe({
        next: () => {
          alert('Compte supprimé avec succès.');
          this.loadComptes(); // Recharger la liste après la suppression
        },
        error: (err) => {
          console.error('Erreur lors de la suppression du compte:', err);
          this.error = 'Erreur lors de la suppression du compte épargne.';
        }
      });
    }
  }
  downloadHistoriquePdf(compteId: number): void {
    this.compteService.genererPdfHistoriqueDepots(compteId).subscribe({
      next: (response) => {
        const blob = response.body;
        const filename = `historique_depots_compte_${compteId}.pdf`;
        if (blob) {
          saveAs(blob, filename);
        }
      },
      error: (err) => {
        console.error('Erreur lors du téléchargement du PDF:', err);
        this.error = 'Erreur lors du téléchargement de l\'historique des dépôts.';
      }
    });
  }
}