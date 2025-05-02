import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scheduled-transfers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scheduled-transfers.component.html',
  styleUrls: ['./scheduled-transfers.component.css']
})
export class ScheduledTransfersComponent {
  // Placeholder component
  scheduledTransfers = [
    { id: 1, amount: 100, date: '2023-06-15', status: 'Pending' },
    { id: 2, amount: 250, date: '2023-06-20', status: 'Scheduled' }
  ];
}