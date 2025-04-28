import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserSelectionComponent } from './FrontOffice/dashboard/components/user-selection/user-selection.component';
import {BalanceComponent} from './FrontOffice/dashboard/components/balance/balance.component';
import {TransactionsComponent} from './FrontOffice/dashboard/components/transactions/transactions.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    UserSelectionComponent,
    BalanceComponent,
    TransactionsComponent,    MonteCarloSimulationComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
     // Add FormsModule to the imports array
    CommonModule,

    ReactiveFormsModule
  ],
  exports: [
    BalanceComponent
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
