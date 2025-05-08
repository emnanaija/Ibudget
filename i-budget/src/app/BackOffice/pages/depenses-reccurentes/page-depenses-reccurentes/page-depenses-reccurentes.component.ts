import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepensesComponent } from '../../../expenses/depenses/depenses.component'; // adapte le chemin selon ton projet
import { SidebarComponent } from '../../../expenses/sidebar/sidebar.component';
import { HeaderComponent } from '../../../expenses/header/header.component';
import { AjoutDepenseComponent } from '../../../expenses/ajout-depense/ajout-depense.component'; // adapte le chemin selon ton projet
import { DepenseReccurenteAjoutComponent } from '../../../expenses/ajout-depenses-reccurentes/depense-reccurente-ajout/depense-reccurente-ajout.component'; // adapte le chemin selon ton projet
import { DepensesSimulationComponent } from '../../../expenses/depenses-simulation-graph/depenses-simulation-graph.component'; // Import du composant de simulation
import { PichartdepenseComponent } from '../../../expenses/pichartdepense/pichartdepense.component'; // Import du composant de simulation
import { AnimatedBackgroundComponent } from '../../../../FrontOffice/dashboard/components/animated-background/animated-background.component';
import {BackofficeNavbarComponent} from '../../../BackofficeNavbarComponent/BackofficeNavbarComponent';

@Component({
  selector: 'app-page-depenses-reccurentes',
  imports: [
    CommonModule,
   
    SidebarComponent,
    HeaderComponent,
    AnimatedBackgroundComponent,
    DepenseReccurenteAjoutComponent,
    DepensesSimulationComponent ,
    PichartdepenseComponent,
    BackofficeNavbarComponent
  ],
  templateUrl: './page-depenses-reccurentes.component.html',
  styleUrl: './page-depenses-reccurentes.component.css'
})
export class PageDepensesReccurentesComponentback {
  isSidebarCollapsed = false; // Propriété définie, initialisée à false par défaut

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Inverse la valeur de isSidebarCollapsed
  }
}
