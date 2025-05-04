export interface RegisterRequest {
  aiTonePreference: 'FORMAL' | 'INFORMAL' | 'FRIENDLY';
  dateOfBirth:Date;
  email: string;
  financialKnowledgeLevel: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
  firstName: string;
  gender: 'FEMALE' | 'MALE';
  lastName: string;
  password: string;
  phoneNumber: string;
  profession: string;
}
