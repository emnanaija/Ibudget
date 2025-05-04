import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}


  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
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
}
