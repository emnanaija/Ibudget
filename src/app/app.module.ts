import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';  // Importation du module HttpClient

import { AppComponent } from './app.component';
import { DepensesComponent } from'./features/backoffice/depenses/depenses.component';

@NgModule({
  declarations: [
    AppComponent,
    DepensesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule  // Ajoutez cette ligne pour importer HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
