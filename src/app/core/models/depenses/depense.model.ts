// models/depense.model.ts
export interface Wallet {
    id: number;
    solde: number;
    statut: string;
    dateOuverture: string;
  }
  
  export interface Category {
    id: number;
    nom: string;
    description: string | null;
    budgetAlloué: number;
    montantDepensé: number;
    depenses?: Depense[];
    soldeRestant: number;
  }
  
  export interface Depense {
    id: number;
    montant: number;
    date: string;
    etat: string;
    wallet: Wallet;
    category: Category | number;
    photoUrl: string | null;
  }