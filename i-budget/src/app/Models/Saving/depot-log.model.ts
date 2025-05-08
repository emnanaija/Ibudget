import { CompteEpargne } from './compte-epargne.model';

export interface DepotLog {
  id?: number;
  montant: number; // BigDecimal devient number en TypeScript
  frequenceDepot: string;
  dateDepot: Date | string; // Selon comment vous traitez les dates
  dateSuppression: Date | string;
  compteEpargne: CompteEpargne | number; // Peut être l'objet complet ou juste l'ID
}