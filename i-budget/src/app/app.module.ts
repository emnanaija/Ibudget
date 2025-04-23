import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserSelectionComponent } from './FrontOffice/components/user-selection/user-selection.component';
import {BalanceComponent} from './FrontOffice/components/balance/balance.component';
import {TransactionsComponent} from './FrontOffice/components/transactions/transactions.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    UserSelectionComponent,
    BalanceComponent,
    TransactionsComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,

    ReactiveFormsModule
  ],
  exports: [
    BalanceComponent
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
