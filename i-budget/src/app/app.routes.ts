import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './FrontOffice/dashboardAdmin/dashboardAdmin.component';
import {AccountsManagementComponent} from './accounts/accounts-management/accounts-management.component';
import {AccountListComponent} from './accounts/account-list/account-list.component';
import {AccountDetailsComponent} from './accounts/account-details/account-details.component';
import {AccountCreateComponent} from './accounts/account-create/account-create.component';
import {RechargeAccountComponent} from './accounts/recharge-account/recharge-account.component';
import {DashboardComponent} from './FrontOffice/dashboard/dashboard.component';

// Import other components as needed

export const routes: Routes = [
  { path: 'dashboard', component: DashboardAdminComponent },
  { path: 'dashboardfront', component: DashboardComponent },
  {
    path: 'accounts',
    component: AccountsManagementComponent,
    children: [
      { path: 'list', component: AccountListComponent },
      { path: 'details/:id', component: AccountDetailsComponent },
      { path: 'create', component: AccountCreateComponent },
      { path: 'recharge', component: RechargeAccountComponent },
      { path: '', redirectTo: 'list', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Other routes
];



