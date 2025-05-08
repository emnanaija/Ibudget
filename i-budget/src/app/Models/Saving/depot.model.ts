import { CompteEpargne } from './compte-epargne.model';

export interface Depot {
  id?: number;
  montant: number;
  dateDepot: Date | string;
  frequenceDepot: string;
  prochainDepot?: Date | string | null;
  compteEpargne?: CompteEpargne;  // Optionnel si tu veux le lier dans le frontend
}
