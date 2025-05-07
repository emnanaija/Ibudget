import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoinService } from '../../../../services/investments/coin/coin.service';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
// Suppression de l'import du WalletService et du WalletComponent

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule], // Suppression de WalletComponent des imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isSidebarCollapsed = false;
  @Output() searchResults = new EventEmitter<any[]>();
  private searchInput$ = new Subject<string>();
  private subscription: Subscription | undefined;
  searchResultsLocal: any[] = [];
  showSearchResultsDropdown = false;

  // Utilisation de HostBinding pour lier une classe au search-container
  @HostBinding('class.search-active') get isSearchActive(): boolean {
    return this.showSearchResultsDropdown && (this.searchResultsLocal?.length > 0);
  }

  constructor(
    private coinService: CoinService,
    private router: Router,
    // Suppression de l'injection du WalletService
  ) { }

  ngOnInit(): void {
    this.subscription = this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(keyword => {
        if (!keyword.trim()) {
          this.searchResultsLocal = [];
          this.showSearchResultsDropdown = false;
          return of([]);
        }
        this.showSearchResultsDropdown = true;
        return this.coinService.searchCoin(keyword).pipe(
          catchError(error => {
            console.error('Error during search:', error);
            this.searchResultsLocal = [];
            this.showSearchResultsDropdown = false;
            return of([]);
          })
        );
      })
    ).subscribe({
      next: (results) => {
        this.searchResultsLocal = Array.isArray(results?.coins) ? results.coins : (Array.isArray(results) ? results : (results ? [results] : []));
        this.searchResults.emit(this.searchResultsLocal);
      },
      error: (error) => {
        console.error('Error in subscription:', error);
        this.searchResultsLocal = [];
        this.showSearchResultsDropdown = false;
        this.searchResults.emit([]);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.searchInput$.next(target.value);
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.showSearchResultsDropdown = false;
    }, 200);
  }

  selectSearchResult(coin: any): void {
    this.searchResultsLocal = [];
    this.showSearchResultsDropdown = false;
    this.router.navigate(['/coins/details', coin.id]);
  }

  goToWalletPage(): void {
    this.router.navigate(['/wallet']);
  }
}
