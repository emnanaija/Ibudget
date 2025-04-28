import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepensesComponent } from '../../../components/depenses/depenses.component'; // adapte le chemin selon ton projet
import { SidebarComponent } from '../../../sidebar/sidebar.component';
import { HeaderComponent } from '../../../header/header.component';
import { AjoutDepenseComponent } from '../../../components/ajout-depense/ajout-depense.component'; // adapte le chemin selon ton projet
import { DepenseReccurenteAjoutComponent } from '../../../components/ajout-depenses-reccurentes/depense-reccurente-ajout/depense-reccurente-ajout.component'; // adapte le chemin selon ton projet
import { DepensesSimulationComponent } from '../../../components/depenses-simulation-graph/depenses-simulation-graph.component'; // Import du composant de simulation
import { PichartdepenseComponent } from '../../../components/pichartdepense/pichartdepense.component'; // Import du composant de simulation

@Component({
  selector: 'app-page-depenses-reccurentes',
  imports: [
    CommonModule,
   
    SidebarComponent,
    HeaderComponent,
 
    DepenseReccurenteAjoutComponent,
    DepensesSimulationComponent ,
    PichartdepenseComponent
  ],
  templateUrl: './page-depenses-reccurentes.component.html',
  styleUrl: './page-depenses-reccurentes.component.css'
})
export class PageDepensesReccurentesComponent {
  isSidebarCollapsed = false; // Propriété définie, initialisée à false par défaut

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Inverse la valeur de isSidebarCollapsed
  }
}
