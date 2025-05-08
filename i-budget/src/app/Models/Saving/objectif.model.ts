import { CompteEpargne } from './compte-epargne.model';

export interface Objectif {
  id?: number;
  nom: string;
  montantObjectif: number;
  dateCreation: Date;
  dateEstimee?: Date;  // Calculée automatiquement, non saisie

  compteEpargne?: CompteEpargne;
}
