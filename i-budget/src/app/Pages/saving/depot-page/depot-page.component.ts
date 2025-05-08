// depot-page.component.ts
import { Component } from '@angular/core';
import { DepotFormComponent } from '../../../FrontOffice/dashboard/components/saving/depot/depot-form/depot-form.component';
import { DepotListComponent } from '../../../FrontOffice/dashboard/components/saving/depot/depot-list/depot-list.component';
import { SimulationDepotFormComponent } from '../../../FrontOffice/dashboard/components/saving/depot/simulation-depot-form/simulation-depot-form.component';
import { SidebarComponent } from '../../../FrontOffice/dashboard/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../FrontOffice/dashboard/components/header/header.component';

@Component({
  selector: 'app-depot-page',
  standalone: true,
  imports: [DepotFormComponent, DepotListComponent, SimulationDepotFormComponent, SidebarComponent, HeaderComponent],
  templateUrl: './depot-page.component.html',
  styleUrls: ['./depot-page.component.css']
})
export class DepotPageComponent {
  isSidebarCollapsed = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }
}