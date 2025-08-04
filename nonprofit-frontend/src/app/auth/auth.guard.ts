import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Always allow access to login/register pages
    if (state.url.includes('/login') || state.url.includes('/register')) {
      return true;
    }

    // For all other routes, check authentication
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Not logged in - redirect to login
    this.router.navigate(['/login']);
    return false;
  }
}
