// models/depense.model.ts
export interface Category {
    id: number;
    nom: string;
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
    category: Category | number;
    wallet?: Wallet;  // Si tu veux utiliser wallet, il faut le définir ici
    photoUrl?: string;
  }