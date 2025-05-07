export interface Withdrawal {

   id: number;
  
  amount: number;
  
   status: string;
  
  requestDate: string;
  
   processedDate: string;
   walletId?: number; // Ajout de walletId (optionnel car il peut être nul)
   walletBalance?: number;
  
 // ... autres propriétés ...
  
   }