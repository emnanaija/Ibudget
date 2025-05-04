export interface UpdateUserRequest {
    currentPassword: string;
    aiTonePreference?: 'FORMAL' | 'INFORMAL' | 'FRIENDLY';
    email?: string;
    financialKnowledgeLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
    phoneNumber?: string;
    profession?: string;
  }