import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-money-go',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './money-go.component.html',
  styleUrls: ['./money-go.component.css']
})
export class MoneyGoComponent {
  moneyItems = [
    { category: 'Food and Drinks', amount: '872.40' },
    { category: 'Shopping', amount: '1378.20' },
    { category: 'Housing', amount: '928.50' },
    { category: 'Transportation', amount: '420.70' },
    { category: 'Vehicle', amount: '520.00' }
  ];
}