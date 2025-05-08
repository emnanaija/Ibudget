import { Component, OnInit, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DepensesService } from '../../../../../services/depenses/depenses.service';
import { Depense, Category, Wallet } from '../../../../../Models/depenses/depense.model';
import { NgIf, AsyncPipe,CommonModule, CurrencyPipe, DatePipe } from '@angular/common'; // ✅ Ajout ici
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-depenses',
  templateUrl: './depenses.component.html',
  styleUrls: ['./depenses.component.css'],
  imports: [CommonModule,
    NgIf,
    AsyncPipe,
    CurrencyPipe,
    DatePipe], // ✅ CommonModule suffit en général car il contient currency et date pipes

  standalone: true

})
export class DepensesComponent implements OnInit {
  depenses$!: Observable<Depense[]>;
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  isSidebarCollapsed = false; // Propriété définie, initialisée à false par défaut
  expandedIndex: number = -1; // Pour suivre l'élément déplié, -1 signifie aucun

  constructor(private depensesService: DepensesService) {}

  ngOnInit(): void {
    this.loadDepenses();
  }

  private loadDepenses(): void {
    this.isLoading.set(true);
    this.depenses$ = this.depensesService.getDepenses().pipe(
      finalize(() => this.isLoading.set(false)),
      catchError((error: Error) => {
        this.errorMessage.set(error.message);
        return of([]);
      })
    );
  }

  // Mise à jour de la méthode de vérification de la catégorie
  isCategoryObject(category: Category | number | undefined): category is Category {
    return category !== undefined && typeof category !== 'number' && 'nom' in category;
  }

  modifierEtat(depense: Depense) {
    // TODO: Implémenter la logique de modification de l'état
    console.log('Modification de l\'état pour la dépense:', depense);
  }
  
  toggleDepense(index: number): void {
    // Si le même index est cliqué, on ferme le dropdown, sinon on l'ouvre
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }

  imageSelectionnee: string | null = null;

  toggleImage(photoUrl: string) {
    // Si l'image est déjà agrandie, on la rétrécit, sinon on l'agrandit
    if (this.imageSelectionnee === photoUrl) {
      this.imageSelectionnee = null;
    } else {
      this.imageSelectionnee = photoUrl;
    }
  }

  exporterDepenses() {
    this.depensesService.exportDepensesExcel().subscribe(
      (data: Blob) => {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'depenses.xlsx');
      },
      (error) => {
        console.error('Erreur lors de l’exportation :', error);
      }
    );
  }
}
