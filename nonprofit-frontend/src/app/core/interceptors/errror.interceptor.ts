import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../shared/notification.service';
// import { AuthService } from '../../shared/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const router = inject(Router);
  // const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!error.status) {
        notification.showError('Network error - please check your connection');
      } else if (error.status === 401) {
        // authService.clearAuthState();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
        });
        notification.showError('Session expired - please login again');
      } else if (error.status === 403) {
        notification.showError('You do not have permission for this action');
      } else if (error.status >= 500) {
        notification.showError('Server error - please try again later');
      } else {
        notification.showError('An unexpected error occurred');
      }
      return throwError(() => error);
    })
  );
};
