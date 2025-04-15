// src/app/models/expense-category.model.ts
export interface ExpenseCategory {
    id?: number;
    nom: string;
    description: string;
    budgetAlloue: number;
    montantDepense?: number;
    soldeRestant?: number;    // modifiable par le système seulement
}
  