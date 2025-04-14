import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepensesComponent } from '../../components/depenses/depenses.component'; // adapte le chemin selon ton projet

@Component({
  selector: 'app-page-desDepenses',
  standalone: true,
  imports: [CommonModule, DepensesComponent],
  templateUrl: './page-des-Depenses.component.html',
  styleUrls: ['./page-des-Depenses.component.css']
})
export class PageDesDepensesComponent {}
