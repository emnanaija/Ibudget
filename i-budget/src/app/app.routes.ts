import { Routes } from '@angular/router';
import { DashboardComponent } from './FrontOffice/dashboard/dashboard.component';
import {SimCardAccountsComponent} from './FrontOffice/components/sim-card-accounts/sim-card-accounts.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'sim-card-accounts',
    component: SimCardAccountsComponent
  }

];



