import { FeteComponent } from '../../expenses/fete/fete.component';  // Importer le composant FeteComponent



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepensesComponent } from '../../expenses/depenses/depenses.component'; // adapte le chemin selon ton projet
import { SidebarComponent } from '../../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../components/header/header.component';
import {AjoutDepenseComponent } from '../../expenses/ajout-depense/ajout-depense.component'; // adapte le chemin selon ton projet
import { AnimatedBackgroundComponent } from '../../animated-background/animated-background.component';


@Component({
  selector: 'app-fete-page',
  standalone: true,
  imports: [CommonModule,SidebarComponent,HeaderComponent,FeteComponent,AnimatedBackgroundComponent
      ],
  templateUrl: './fete-page.component.html',
  styleUrls: ['./fete-page.component.css']
})
export class FetePageComponent {
  isSidebarCollapsed = false; // Propriété définie, initialisée à false par défaut

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Inverse la valeur de isSidebarCollapsed
  }
}
