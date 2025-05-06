import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  getAccessToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  saveTokens(accessToken: string, refreshToken: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const requestHeader = new HttpHeaders({
        'No-Auth': 'True',
        'Authorization': `Bearer ${refreshToken}`
      });
      
      const response: any = await firstValueFrom(
        this.http.post('http://localhost:8090/user/refreshToken', {}, {
          headers: requestHeader
        })
      );
      this.saveTokens(response.accessToken, response.refreshToken);
      return true;
    } catch {
      return false;
    }
  }

  getCurrentUserId(): number | null {
    const token = this.getAccessToken();
    if (!token) {
      // fallback to localStorage userId
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          const id = Number(storedUserId);
          return isNaN(id) ? null : id;
        }
      }
      return null;
    }

    try {
      // JWT token format: header.payload.signature
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      // Assuming user ID is stored in 'userId' claim or 'sub' claim
      if (payload.userId) {
        return Number(payload.userId);
      } else if (payload.sub && !isNaN(Number(payload.sub))) {
        return Number(payload.sub);
      } else {
        // fallback to localStorage userId
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          const id = Number(storedUserId);
          return isNaN(id) ? null : id;
        }
        return null;
      }
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      // fallback to localStorage userId
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        const id = Number(storedUserId);
        return isNaN(id) ? null : id;
      }
      return null;
    }
  }
}
