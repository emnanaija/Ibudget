
import { ExpenseCategory } from './expense-category.model';
import { FrequenceDepense } from './frequence-depense.enum';
export interface Wallet {
  id:number;
  }
export interface DepenseReccurente {
  id?: number;
  wallet: Wallet;
  categorie: ExpenseCategory;
  montant: number;
  dateDebut: string;  // ISO format: '2025-04-23'
  dateFin?: string;
  frequence: FrequenceDepense;
}
