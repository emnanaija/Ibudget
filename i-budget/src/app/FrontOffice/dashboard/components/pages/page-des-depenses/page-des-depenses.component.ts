import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepensesComponent } from '../../expenses/depenses/depenses.component'; // adapte le chemin selon ton projet
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { AjoutDepenseComponent } from '../../expenses/ajout-depense/ajout-depense.component'; // adapte le chemin selon ton projet
import { DepenseReccurenteAjoutComponent } from '../../expenses/ajout-depenses-reccurentes/depense-reccurente-ajout/depense-reccurente-ajout.component'; // adapte le chemin selon ton projet
import { DepensesSimulationComponent } from '../../expenses/depenses-simulation-graph/depenses-simulation-graph.component'; // Import du composant de simulation
import { AnimatedBackgroundComponent } from '../../animated-background/animated-background.component';

@Component({
  selector: 'app-page-desDepenses',
  standalone: true,
  imports: [
    CommonModule,
    DepensesComponent,
    SidebarComponent,
    HeaderComponent,
    AjoutDepenseComponent,
    DepenseReccurenteAjoutComponent,
    DepensesSimulationComponent,
    AnimatedBackgroundComponent
      ],
  templateUrl: './page-des-Depenses.component.html',
  styleUrls: ['./page-des-Depenses.component.css']
})
export class PageDesDepensesComponent {
  isSidebarCollapsed = false; // Propriété définie, initialisée à false par défaut

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Inverse la valeur de isSidebarCollapsed
  }
}
