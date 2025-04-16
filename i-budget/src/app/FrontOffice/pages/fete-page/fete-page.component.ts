import { Component } from '@angular/core';
import { FeteComponent } from '../../components/fete/fete.component';  // Importer le composant FeteComponent

@Component({
  selector: 'app-fete-page',
  standalone: true,  // Déclarer ce composant comme standalone
  imports: [FeteComponent],  // Importer le composant FeteComponent ici
  template: `
    <h1>Fêtes du mois</h1>
    <app-fete></app-fete>  <!-- Utilisation du composant FeteComponent -->
  `
})
export class FetePageComponent {

}
