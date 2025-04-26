import { Routes } from '@angular/router';
import { DashboardComponent } from './FrontOffice/dashboard/dashboard.component';
import { SimCardAccountsComponent } from './FrontOffice/components/sim-card-accounts/sim-card-accounts.component';
import { PageDesDepensesComponent } from './FrontOffice/pages/page-des-depenses/page-des-depenses.component';
import { ExpenseCategoryPageComponent } from './FrontOffice/pages/expense-categories/expense-category-page/expense-category-page.component'; // Assure-toi que le chemin est correct
import { FetePageComponent } from './FrontOffice/pages/fete-page/fete-page.component'; // Assure-toi que le chemin est correct
import { PageDepensesReccurentesComponent } from './FrontOffice/pages/depenses-reccurentes/page-depenses-reccurentes/page-depenses-reccurentes.component'; // Assure-toi que le chemin est correct

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'sim-card-accounts', component: SimCardAccountsComponent },
  { path: 'depenses', component: PageDesDepensesComponent },
  { path: 'ajoutercategorie', component: ExpenseCategoryPageComponent },
  { path: 'fetes', component: FetePageComponent },  // Définir la route pour la page des fêtes
  { path: 'depensesReccurentes', component:PageDepensesReccurentesComponent  }  // Définir la route pour la page des fêtes

];
