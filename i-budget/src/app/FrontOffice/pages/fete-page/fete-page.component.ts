import { FeteComponent } from '../../components/fete/fete.component';  // Importer le composant FeteComponent



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepensesComponent } from '../../components/depenses/depenses.component'; // adapte le chemin selon ton projet
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HeaderComponent } from '../../header/header.component';
import {AjoutDepenseComponent } from '../../components/ajout-depense/ajout-depense.component'; // adapte le chemin selon ton projet

@Component({
  selector: 'app-fete-page',
  standalone: true,
  imports: [CommonModule,SidebarComponent,HeaderComponent,FeteComponent
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
