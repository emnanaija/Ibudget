export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export enum Tone {
  FORMAL = 'FORMAL',
  CASUAL = 'CASUAL'
}

export enum FinancialKnowledgeLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum TypeAccount {
  PREMIUM = 'PREMIUM',
  FREEMIUM = 'FREEMIUM'
}

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: Date;
  gender: Gender;
  profession: string;
  aiTonePreference: Tone;
  financialKnowledgeLevel: FinancialKnowledgeLevel;
  accountLocked: boolean;
  accountEnabled: boolean;
  accountType: TypeAccount;
  phoneNumber: string;
  createdDate: Date;
  lastModifiedDate: Date;
  role: {
    id: number;
    name: string;
  };
} 