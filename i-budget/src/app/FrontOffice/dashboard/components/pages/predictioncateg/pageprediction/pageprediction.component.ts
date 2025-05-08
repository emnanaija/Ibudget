import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepensesComponent } from '../../../expenses/depenses/depenses.component'; // adapte le chemin selon ton projet
import { SidebarComponent } from '../../../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../../components/header/header.component';
import { AjoutDepenseComponent } from '../../../expenses/ajout-depense/ajout-depense.component'; // adapte le chemin selon ton projet
import { DepenseReccurenteAjoutComponent } from '../../../expenses/ajout-depenses-reccurentes/depense-reccurente-ajout/depense-reccurente-ajout.component'; // adapte le chemin selon ton projet
import { DepensesSimulationComponent } from '../../../expenses/depenses-simulation-graph/depenses-simulation-graph.component'; // Import du composant de simulation
import { AnimatedBackgroundComponent } from '../../../animated-background/animated-background.component';
import { PredictionComponent } from '../../../expenses/prediction/prediction.component';

@Component({
  selector: 'app-pageprediction',
  imports: [
    CommonModule,
    DepensesComponent,
    SidebarComponent,
    HeaderComponent,
    AjoutDepenseComponent,
    DepenseReccurenteAjoutComponent,
    DepensesSimulationComponent,
    AnimatedBackgroundComponent,
    PredictionComponent  ],  templateUrl: './pageprediction.component.html',
  styleUrl: './pageprediction.component.css',
  standalone: true,


})
export class PagepredictionComponent {
  isSidebarCollapsed = false; // Propriété définie, initialisée à false par défaut

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Inverse la valeur de isSidebarCollapsed
  }
}
