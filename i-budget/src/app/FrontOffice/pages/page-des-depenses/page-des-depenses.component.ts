import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepensesComponent } from '../../components/depenses/depenses.component'; // adapte le chemin selon ton projet
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-page-desDepenses',
  standalone: true,
  imports: [CommonModule, DepensesComponent,
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
