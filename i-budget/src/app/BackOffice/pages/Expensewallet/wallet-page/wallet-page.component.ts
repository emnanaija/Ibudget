import { Component, OnInit } from '@angular/core';
import { WalletListComponent } from '../../../expenses/Wallet/wallet-list/wallet-list.component'; // Assure-toi du bon chemin du composant
import {BackofficeNavbarComponent} from '../../../BackofficeNavbarComponent/BackofficeNavbarComponent';
import { AnimatedBackgroundComponent } from '../../../../FrontOffice/dashboard/components/animated-background/animated-background.component';

@Component({
  selector: 'app-wallet-page',
  standalone: true,
  templateUrl: './wallet-page.component.html',
  styleUrls: ['./wallet-page.component.css'],
  imports: [WalletListComponent,AnimatedBackgroundComponent,BackofficeNavbarComponent] // Ajoute ici le composant WalletListComponent
})
export class WalletPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // Tu peux ajouter une logique ici si nécessaire, comme un appel API pour charger d'autres données spécifiques à la page
  }

}
