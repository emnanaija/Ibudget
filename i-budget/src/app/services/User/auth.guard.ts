import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // Add a static flag to track if we're checking auth
  private static isCheckingAuth = false;

  constructor(private router: Router, private userService: UserService) {
    // Apply redirecting class immediately when the guard is loaded
    // This helps prevent the initial flash
    document.body.classList.add('redirectingAuth');
  }
  
  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Mark that we're checking auth
    AuthGuard.isCheckingAuth = true;
    
    // Store the attempted URL for redirecting
    const currentUrl = state.url;
    
    // Apply CSS to prevent content flash while checking
    document.body.classList.add('redirectingAuth');
    
    // Check if token exists in localStorage
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.log('No access token found, redirecting to login');
      
      // Return a Promise to ensure the route doesn't activate momentarily
      return new Promise<boolean>(resolve => {
        // Delay redirect slightly to ensure navigation works properly
        setTimeout(() => {
          // Navigate to login
          this.router.navigate(['/signupRegister']).then(() => {
            // Only remove the CSS class after navigation completes
            setTimeout(() => {
              AuthGuard.isCheckingAuth = false;
              document.body.classList.remove('redirectingAuth');
              // Resolve with false to prevent route activation
              resolve(false);
            }, 100);
          });
        }, 10);
      });
    }
    
    // At this point we have a token, now verify if it's valid and check roles
    const canAccess = this.verifyAuthAndRole(route, currentUrl);
    
    // If the user is authorized, remove the CSS class
    if (canAccess) {
      setTimeout(() => {
        AuthGuard.isCheckingAuth = false;
        document.body.classList.remove('redirectingAuth');
      }, 100);
    }
    
    return canAccess;
  }
  
  private verifyAuthAndRole(route: ActivatedRouteSnapshot, currentUrl: string): boolean {
    const userRole = localStorage.getItem('role') || '';
    const allowedRoles = route.data['roles'] as Array<string> | undefined;
    
    console.log('User role:', userRole);
    console.log('Allowed roles:', allowedRoles);
    
    // If roles are required but user doesn't have a matching role
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      console.log('User does not have required role');
      
      // Return a Promise to ensure the route doesn't activate momentarily
      return false;
    }
    
    // User is authenticated and authorized
    console.log('Authentication and authorization successful');
    return true;
  }
}