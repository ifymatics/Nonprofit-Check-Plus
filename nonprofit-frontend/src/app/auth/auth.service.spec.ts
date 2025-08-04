import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../shared/notification.service';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/auth';
  currentUser$ = new BehaviorSubject<User | null>(null);
  private authChecked = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService
  ) {}

  // Registration with automatic login
  register(userData: RegisterData): Observable<User> {
    return this.http
      .post<User>(`${this.API_URL}/register`, userData, {
        withCredentials: true,
      })
      .pipe(
        tap({
          next: (user) => {
            this.currentUser$.next(user);
            this.authChecked = true;
            this.notification.showSuccess('Registration successful!');
          },
          error: (err) => {
            this.notification.showError(
              err.error?.message || 'Registration failed. Please try again.'
            );
          },
        })
      );
  }

  // Login with cookie-based authentication
  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(
        `${this.API_URL}/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap({
          next: (user) => {
            this.currentUser$.next(user);
            this.authChecked = true;
            this.notification.showSuccess('Login successful');
          },
          error: (err) => {
            this.notification.showError(err.error?.message || 'Login failed');
          },
        })
      );
  }

  // Logout with server-side session invalidation
  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.API_URL}/logout`, {}, { withCredentials: true })
      .pipe(
        tap({
          next: () => {
            this.clearAuthState();
            this.notification.showSuccess('Logged out successfully');
            this.router.navigate(['/login']);
          },
          error: () => {
            this.clearAuthState();
            this.notification.showError('Session ended');
            this.router.navigate(['/login']);
          },
        })
      );
  }

  // Public method to clear authentication state
  clearAuthState(): void {
    this.currentUser$.next(null);
    this.authChecked = true;
    // Clear any other auth-related state here if needed
  }

  // Check authentication status
  isAuthenticated(): Observable<boolean> {
    if (!this.authChecked) {
      return this.checkAuthStatus().pipe(
        tap(() => (this.authChecked = true)),
        map((user) => !!user)
      );
    }
    return this.currentUser$.pipe(map((user) => !!user));
  }

  // Verify auth status with server
  checkAuthStatus(): Observable<User | null> {
    return this.http
      .get<User>(`${this.API_URL}/status`, { withCredentials: true })
      .pipe(
        tap({
          next: (user) => {
            this.currentUser$.next(user);
            this.authChecked = true;
          },
          error: () => {
            this.clearAuthState();
          },
        }),
        catchError(() => of(null))
      );
  }

  // Initialize auth state when app starts
  initializeAuthState(): void {
    this.checkAuthStatus().subscribe();
  }
}
