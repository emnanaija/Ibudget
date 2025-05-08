// models/depense.model.ts
export interface Category {
    id: number;
    nom: string;
    description: string;
    budgetAlloue: number;
    montantDepense?: number;
    soldeRestant?: number;
  }

  export interface Wallet {
    solde: number;
    statut: string;
  }
// src/app/models/depense.model.ts

  export interface Depense {
    id: number;
    montant: number;
    date: string;
    etat: string;
    category: Category ;
    wallet: Wallet;  // Si tu veux utiliser wallet, il faut le définir ici
    photoUrl?: string;
  }
