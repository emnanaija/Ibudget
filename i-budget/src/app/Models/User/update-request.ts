export interface UpdateRequest {
  firstName?: string;
  lastName?: string;
  dateOfBirth?:Date | null;
  currentPassword: string;
}