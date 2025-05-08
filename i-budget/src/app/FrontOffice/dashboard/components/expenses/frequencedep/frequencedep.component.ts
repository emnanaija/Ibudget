import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { DepenseReccurenteService } from '../../../../../services/depenses-reccurentes/depenses-reccurentes.service';
import { DepenseReccurente } from '../../../../../Models/depenses/depense-reccurente.model';

@Component({
  selector: 'app-frequencedep',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './frequencedep.component.html',
  styleUrls: ['./frequencedep.component.css']
})
export class FrequencedepComponent implements OnInit {
  depenses: DepenseReccurente[] = [];

  // Exemple : { '2025-06-01': true }
  prochainesDatesByDate: { [date: string]: string } = {}; 

  constructor(private depenseService: DepenseReccurenteService) {}

  ngOnInit(): void {
    this.depenseService.getAllDepenses().subscribe((data) => {
      this.depenses = data || [];
    });

    this.depenseService.getProchainesDatesExecution().subscribe((data: { [key: string]: string }) => {
      // Construire un objet indexé par date pour vérifier plus facilement dans le template
      for (const key in data) {
        const date = data[key];
        this.prochainesDatesByDate[date] = date;
      }
    });
  }

  getCalendarRows(): { date: string }[][] {
    const rows: { date: string }[][] = [];

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0 = Janvier
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Dimanche
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let currentRow: { date: string }[] = [];
    let day = 1;

    // Décalage : débuter la semaine le lundi
    const startIndex = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startIndex; i++) {
      currentRow.push({ date: '' });
    }

    while (day <= daysInMonth) {
      const fullDate = new Date(year, month, day).toISOString().split('T')[0];
      currentRow.push({ date: fullDate });

      if (currentRow.length === 7) {
        rows.push(currentRow);
        currentRow = [];
      }
      day++;
    }

    if (currentRow.length > 0) {
      while (currentRow.length < 7) {
        currentRow.push({ date: '' });
      }
      rows.push(currentRow);
    }

    return rows;
  }

  convertToLocaleDate(date: string): string {
    const d = new Date(date);
    return d.toLocaleDateString();
  }
}
