import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');
  if (isLoggedIn) {
    if(role === 'ROLE_ADMIN'){
    router.navigate(['/roleList']); // Redirect if already logged in
    return false;
    }else if (role === 'ROLE_USER_FREMIUM'|| role ==='ROLE_USER_PREMIUM'){
      router.navigate(['/dashboard']); // Redirect if already logged in
      return false;
    }
    return false;
  }
  return true;
 

};
