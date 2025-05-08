import { TauxInteret } from './taux-interet.model';
import { Objectif } from './objectif.model';
import { Depot } from './depot.model';
import { DepotLog } from './depot-log.model';
import { User } from '../User/user.model';

export interface CompteEpargne {
  id?: number;
  solde: number; // Devrait être de type number car BigDecimal est sérialisé en number dans JSON
  
  tauxInteret?: TauxInteret;
  objectifs?: Objectif[];
  depots?: Depot[];
  depotsSupprimes?: DepotLog[]; // Ajouté pour correspondre à l'entité Java
  user?: User; // Ajouté car c'est une relation ManyToOne obligatoire
}

export interface SimCardAccount {
  id: number;
  balance: number;
  phoneNumber: string;
}