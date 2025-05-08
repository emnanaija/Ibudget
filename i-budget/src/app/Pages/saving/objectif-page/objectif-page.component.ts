// objectif-page.component.ts
import { Component, OnInit } from '@angular/core'; // Importez OnInit
import { Objectif } from '../../../Models/Saving/objectif.model';
import { ObjectifService } from '../../../services/saving/objectif.service';
import { SidebarComponent } from '../../../FrontOffice/dashboard/components/sidebar/sidebar.component';
import { HeaderComponent } from '../../../FrontOffice/dashboard/components/header/header.component';
import { ObjectifFormComponent } from '../../../FrontOffice/dashboard/components/saving/objectif/objectif-form/objectif-form.component';
import { ObjectifListComponent } from '../../../FrontOffice/dashboard/components/saving/objectif/objectif-list/objectif-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-objectif-page',
  imports: [
    SidebarComponent,
    HeaderComponent,
    ObjectifFormComponent,
    ObjectifListComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './objectif-page.component.html',
  styleUrls: ['./objectif-page.component.css'],
})
export class ObjectifPageComponent implements OnInit { // Implémentez OnInit
  showForm = false;
  selectedObjectif: Objectif = { id: 0, nom: '', montantObjectif: 0, dateCreation: new Date(), dateEstimee: new Date(), compteEpargne: { id: 0, solde: 0 } };
  showList = true;
  isSidebarCollapsed = false;
  objectifs: Objectif[] = []; // Pour stocker la liste des objectifs

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  constructor(private objectifService: ObjectifService) {}

  ngOnInit(): void {
    this.loadObjectifsList(); // Charger la liste au chargement du composant
  }

  openCreateForm(): void {
    this.selectedObjectif = { id: 0, nom: '', montantObjectif: 0, dateCreation: new Date(), dateEstimee: new Date(), compteEpargne: { id: 0, solde: 0 } };
    this.showForm = true;
    this.showList = false;
  }

  openEditForm(objectif: Objectif): void {
    this.selectedObjectif = { ...objectif };
    this.showForm = true;
    this.showList = false;
  }

  onObjectifSaved(savedObjectif: Objectif): void {
    if (savedObjectif.id === 0) {
      this.objectifService.createObjectif(savedObjectif).subscribe(() => {
        this.showForm = false;
        this.showList = true;
        this.loadObjectifsList(); // Recharger la liste après la création
      });
    } else if (savedObjectif.id) {
      this.objectifService.updateObjectif(savedObjectif.id, savedObjectif).subscribe(() => {
        this.showForm = false;
        this.showList = true;
        this.loadObjectifsList(); // Recharger la liste après la mise à jour
      });
    }
  }

  loadObjectifsList(): void {
    this.objectifService.getAllObjectifs().subscribe(
      (objectifs) => {
        this.objectifs = objectifs;
        console.log('Liste des objectifs rechargée avec succès', this.objectifs);
      },
      (error) => {
        console.error('Erreur lors du chargement des objectifs', error);
      }
    );
  }

  onFormCancelled(): void {
    this.showForm = false;
    this.showList = true;
  }

  // Gestionnaire pour l'événement objectifAjoute (peut être utilisé pour d'autres actions)
  onObjectifAjoute(): void {
    console.log('Événement objectifAjoute reçu par la page.');
    // Vous pouvez effectuer d'autres actions ici si nécessaire
  }

  // Gestionnaire pour l'événement reload émis par ObjectifFormComponent
  handleReloadObjectifs(): void {
    this.loadObjectifsList(); // Appeler la fonction pour recharger la liste
    console.log('Événement reload reçu, rechargement de la liste.');
  }
}