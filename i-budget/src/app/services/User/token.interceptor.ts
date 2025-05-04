import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, from, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  const noAuth = req.headers.get('No-Auth');
  if (noAuth === 'True') {
    return next(req);
  }

  const accessToken = authService.getAccessToken();
  const clonedRequest = accessToken
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      })
    : req;

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Convert the promise to an Observable
        return from(authService.refreshToken()).pipe(
          switchMap((success) => {
            if (success) {
              const newToken = authService.getAccessToken();
              const retryReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(retryReq);
            } else {
              // Handle failed refresh (logout or redirect here if needed)
              console.warn('Refresh failed. Consider redirecting to login.');
              return throwError(() => error);
            }
          })
        );
      }
      return throwError(() => error);
    })
  );
};
