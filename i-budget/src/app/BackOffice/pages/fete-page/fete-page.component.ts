import { FeteComponent } from '../../expenses/fete/fete.component';  // Importer le composant FeteComponent



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepensesComponent } from '../../expenses/depenses/depenses.component'; // adapte le chemin selon ton projet
import { SidebarComponent } from '../../expenses/sidebar/sidebar.component';
import { HeaderComponent } from '../../expenses/header/header.component';
import {AjoutDepenseComponent } from '../../expenses/ajout-depense/ajout-depense.component'; // adapte le chemin selon ton projet
import { AnimatedBackgroundComponent } from '../../../FrontOffice/dashboard/components/animated-background/animated-background.component';

import {BackofficeNavbarComponent} from '../../BackofficeNavbarComponent/BackofficeNavbarComponent';

@Component({
  selector: 'app-fete-page',
  standalone: true,
  imports: [CommonModule,SidebarComponent,HeaderComponent,FeteComponent,AnimatedBackgroundComponent,BackofficeNavbarComponent
      ],
  templateUrl: './fete-page.component.html',
  styleUrls: ['./fete-page.component.css']
})
export class FetePageComponentback {
  isSidebarCollapsed = false; // Propriété définie, initialisée à false par défaut

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed; // Inverse la valeur de isSidebarCollapsed
  }
}
