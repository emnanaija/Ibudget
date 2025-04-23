import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserSelectionComponent } from './FrontOffice/components/user-selection/user-selection.component';
import { TransactionsComponent } from './FrontOffice/components/transactions/transactions.component';

const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UserSelectionComponent },
  { path: 'transactions/:id', component: TransactionsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 