import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  let isLoggedIn = false;
  let role: string | null = null;

  if (isPlatformBrowser(platformId)) {
    isLoggedIn = !!localStorage.getItem('accessToken');
    role = localStorage.getItem('role');
  }

  if (isLoggedIn) {
    if(role === 'ROLE_ADMIN'){
      router.navigate(['/dashboard']); // Redirect if already logged in
      return false;
    } else if (role === 'ROLE_USER_FREMIUM' || role === 'ROLE_USER_PREMIUM'){
      router.navigate(['/dashboardfront']); // Redirect if already logged in
      return false;
    }
    return false;
  }
  return true;
};
