import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CompteEpargne } from '../../../Models/Saving/compte-epargne.model';
import { ObjectifService } from '../../../services/saving/objectif.service'; // Assurez-vous d'utiliser le bon service ici (CompteEpargneService)
import { Subject, takeUntil } from 'rxjs';
import { AnimatedBackgroundComponent } from '../../../FrontOffice/dashboard/components/animated-background/animated-background.component';
import { BackofficeNavbarComponent } from '../../BackofficeNavbarComponent/BackofficeNavbarComponent';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-compte-epargne-list',
  standalone: true,
  imports: [CommonModule, AnimatedBackgroundComponent, BackofficeNavbarComponent],
  providers: [DatePipe],
  templateUrl: './compte-epargne-list.component.html',
  styleUrls: ['./compte-epargne-list.component.css']
})
export class CompteEpargneListComponent implements OnInit, OnDestroy {
  comptes: CompteEpargne[] = [];
  loading = true;
  error = '';
  selectedCompte: CompteEpargne | null = null;
  isDetailsPopupVisible = false;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private compteService: ObjectifService, // Assurez-vous d'utiliser CompteEpargneService ici
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAdminComptes();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadAdminComptes(): void {
    this.loading = true;
    this.error = '';
    this.compteService.getAllAdminComptes()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (data) => {
          this.comptes = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement des comptes admin:', err);
          this.error = 'Erreur lors du chargement des comptes épargne pour l\'administration.';
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
}