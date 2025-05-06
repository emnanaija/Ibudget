import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './User/auth.service';

export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  simCardAccount: any;
  name?: string; // For backward compatibility
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;
  private currentUser: User | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inject AuthService
  ) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getAllUsersByAdmin`).pipe(
      catchError(error => {
        console.error('Error fetching all users:', error);
        return of([]);
      })
    );
  }

  getUserById(id: number): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error fetching user with ID ${id}:`, error);
        return of(null);
      })
    );
  }

  /**
   * Gets the current authenticated user
   * Uses cached user if available, otherwise fetches from server
   */
  getCurrentUser(): Observable<User | null> {
    // Return cached user if available
    if (this.currentUser) {
      return of(this.currentUser);
    }

    // Fetch current user from backend
    return this.http.get<User>(`${this.apiUrl}/current`).pipe(
      tap(user => {
        // Cache the user for future calls
        this.currentUser = user;

        // Add name property if not present
        if (!user.name && user.firstName && user.lastName) {
          user.name = `${user.firstName} ${user.lastName}`;
        }
      }),
      catchError(error => {
        console.error('Error fetching current user:', error);

        // 401: Unauthorized - maybe token expired, attempt silent refresh
        if (error.status === 401) {
          return from(this.authService.refreshToken()).pipe(
            switchMap((refreshed) => {
              if (refreshed) {
                console.log('Token refreshed successfully. Retrying get current user.');
                return this.http.get<User>(`${this.apiUrl}/current`).pipe(
                  tap(retryUser => this.currentUser = retryUser),
                  catchError(retryError => {
                    console.error('Error fetching current user after refresh:', retryError);
                    return of(null);
                  })
                );
              } else {
                console.warn('Token refresh failed.');
                return of(null);
              }
            }),
            catchError((refreshError) => {
              console.error('Error during token refresh:', refreshError);
              return of(null);
            })
          );
        }

        // 403: Forbidden - user authenticated but lacks permission
        if (error.status === 403) {
          console.warn('Access to current user is forbidden. Check user roles or token.');
        }

        return of(null); // Initial fallback with null
      })
    );
  }

  /**
   * Sets the current user (useful after login)
   */
  setCurrentUser(user: User): void {
    // Add name property if not present
    if (user && !user.name && user.firstName && user.lastName) {
      user.name = `${user.firstName} ${user.lastName}`;
    }
    this.currentUser = user;
  }

  /**
   * Clears the current user (useful for logout)
   */
  clearCurrentUser(): void {
    this.currentUser = null;
  }
}
