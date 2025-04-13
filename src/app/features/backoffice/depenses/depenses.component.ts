import { Component, OnInit, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { DepensesService } from '../../../core/services/depenses/depenses.service';
import { Depense, Category, Wallet } from '../../../core/models/depenses/depense.model';

@Component({
  selector: 'app-depenses',
  templateUrl: './depenses.component.html',
  styleUrls: ['./depenses.component.css']
})
export class DepensesComponent implements OnInit {
  depenses$!: Observable<Depense[]>;
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

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

  isCategoryObject(category: Category | number): category is Category {
    return typeof category !== 'number';
  }
}