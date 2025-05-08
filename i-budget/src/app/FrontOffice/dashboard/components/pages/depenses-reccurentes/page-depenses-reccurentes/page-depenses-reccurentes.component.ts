import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepensesComponent } from '../../../expenses/depenses/depenses.component'; // adapte le chemin selon ton projet
import { SidebarComponent } from '../../../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../..//components/header/header.component';
import { AjoutDepenseComponent } from '../../../expenses/ajout-depense/ajout-depense.component'; // adapte le chemin selon ton projet
import { DepenseReccurenteAjoutComponent } from '../../../expenses/ajout-depenses-reccurentes/depense-reccurente-ajout/depense-reccurente-ajout.component'; // adapte le chemin selon ton projet
import { DepensesSimulationComponent } from '../../../expenses/depenses-simulation-graph/depenses-simulation-graph.component'; // Import du composant de simulation
import { PichartdepenseComponent } from '../../../expenses/pichartdepense/pichartdepense.component'; // Import du composant de simulation
import { AnimatedBackgroundComponent } from '../.././../animated-background/animated-background.component';
import { FrequencedepComponent } from '../../../expenses/frequencedep/frequencedep.component'; // adapte le chemin selon ton projet

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
    FrequencedepComponent
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
