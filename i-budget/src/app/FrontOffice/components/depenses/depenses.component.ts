import { Component, OnInit, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DepensesService } from '../../services/depenses/depenses.service';
import { Depense, Category, Wallet } from '../../../models/depenses/depense.model';
import { NgIf, AsyncPipe,CommonModule, CurrencyPipe, DatePipe } from '@angular/common'; // ✅ Ajout ici
import { SidebarComponent } from '../../../FrontOffice/sidebar/sidebar.component'; // adapte le chemin selon ton projet
import { HeaderComponent } from '../../../FrontOffice/header/header.component'; // idem
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

}
