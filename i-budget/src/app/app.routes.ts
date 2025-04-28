import { Routes } from '@angular/router';
import { DashboardAdminComponent } from './BackOffice/dashboardAdmin/dashboardAdmin.component';
import {AccountsManagementComponent} from './BackOffice/accounts/accounts-management/accounts-management.component';
import {AccountListComponent} from './BackOffice/accounts/account-list/account-list.component';
import {AccountDetailsComponent} from './BackOffice/accounts/account-details/account-details.component';
import {AccountCreateComponent} from './BackOffice/accounts/account-create/account-create.component';
import {RechargeAccountComponent} from './BackOffice/accounts/recharge-account/recharge-account.component';
import {DashboardComponent} from './FrontOffice/dashboard/dashboard.component';
import {TransactionManagementComponent} from './BackOffice/transactions/transaction-management.component';

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
  {
    path: 'transactions',
    component: TransactionManagementComponent},
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  // Other routes
];



