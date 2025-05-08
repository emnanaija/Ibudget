import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CompteEpargneService } from '../../../../services/saving/compte-epargne.service';
import { CompteEpargne } from '../../../../Models/Saving/compte-epargne.model';
import { CompteEpargneFormComponent } from '../../../../FrontOffice/dashboard/components/saving/compte-epargne/compte-epargne-form/compte-epargne-form.component';
import { CompteEpargneListComponent } from '../../../../FrontOffice/dashboard/components/saving/compte-epargne/compte-epargne-list/compte-epargne-list.component';
import { CalculInteretFormComponent } from '../../../../FrontOffice/dashboard/components/saving/compte-epargne/calcul-interet-form/calcul-interet-form.component';
import { MonteCarloSimulationComponent } from '../../../../FrontOffice/dashboard/components/saving/simulation/monte-carlo-simulation/monte-carlo-simulation.component';
import { SidebarComponent } from '../../../../FrontOffice/dashboard/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../FrontOffice/dashboard/components/header/header.component';

@Component({
  selector: 'app-compte-epargne-page',
  imports: [CompteEpargneListComponent,CompteEpargneFormComponent,SidebarComponent,HeaderComponent,CalculInteretFormComponent,MonteCarloSimulationComponent],
  templateUrl: './compte-epargne-page.component.html',
  styleUrls: ['./compte-epargne-page.component.css']
})
export class CompteEpargnePageComponent implements OnInit {
  isSidebarCollapsed = false; // Propriété définie, initialisée à false par défaut

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Inverse la valeur de isSidebarCollapsed
  }
  comptes: CompteEpargne[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  
  constructor(private compteService: CompteEpargneService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadComptes();
    }  }

  loadComptes(): void {
    this.isLoading = true;
    this.compteService.getAllComptes().subscribe({
      next: (comptes) => {
        this.comptes = comptes;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMessage = 'Erreur lors du chargement des comptes';
        this.isLoading = false;
      }
    });
  }
}
