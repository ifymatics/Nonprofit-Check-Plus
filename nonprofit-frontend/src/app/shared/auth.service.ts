import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

interface User {
  id: string;
  email: string;
  fullNmae: string;
  role: 'user' | 'admin';
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api/auth';
  currentUser$ = new BehaviorSubject<User | null>(null);
  private authChecked = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService
  ) {}

  /**
   * Register new user with secure HTTP-only cookie session
   */
  register(userData: RegisterData, password: any, name: any): Observable<User> {
    //console.log(`${this.API_URL}/register`);
    return this.http
      .post<User>(`${this.API_URL}/register`, userData, {
        withCredentials: true,
      })
      .pipe(
        tap({
          next: (user) => {
            this.currentUser$.next(user);
            this.notification.showSuccess('Registration successful!');
            this.authChecked = true;
          },
          error: (err) => {
            this.notification.showError(
              err.error?.message || 'Registration failed. Please try again.'
            );
          },
        })
      );
  }

  /**
   * Login with email and password using secure HTTP-only cookies
   */
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
            this.notification.showSuccess('Login successful');
            this.authChecked = true;
          },
          error: (err) => {
            console.log(err);
            this.notification.showError(err.error?.message || 'Login failed');
          },
        })
      );
  }

  /**
   * Logout by clearing the server-side session cookie
   */
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

  /**
   * Check if user is authenticated (with cached result)
   */
  isAuthenticated(): Observable<boolean> {
    if (!this.authChecked) {
      return this.checkAuthStatus().pipe(
        tap(() => (this.authChecked = true)),
        map((user) => !!user)
      );
    }
    return this.currentUser$.pipe(map((user) => !!user));
  }

  /**
   * Verify authentication status with server
   */
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

  /**
   * Get current user data
   */
  getCurrentUser$(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  /**
   * Clear authentication state without server call
   * (Useful for expired sessions)
   */
  clearAuthState(): void {
    this.currentUser$.next(null);
    this.authChecked = true;
  }

  /**
   * Automatic auth check on service initialization
   */
  initializeAuthState(): void {
    this.checkAuthStatus().subscribe();
  }
}
