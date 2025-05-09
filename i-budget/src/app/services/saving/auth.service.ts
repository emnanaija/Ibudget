// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getToken(): string | null {
    // Implémentation basique - à adapter selon votre système d'authentification
    return localStorage.getItem('accessToken');
  }
}