import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',

  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  styleUrls: ['./login.component.scss'],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Welcome Back</h2>
        <p class="subtitle">Please enter your credentials to login</p>

        <form
          (ngSubmit)="onSubmit()"
          [formGroup]="loginForm"
          class="login-form"
        >
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              formControlName="email"
              type="email"
              placeholder="Enter your email"
              [class.invalid]="
                loginForm.get('email')?.invalid &&
                loginForm.get('email')?.touched
              "
            />
            @if (loginForm.get('email')?.invalid &&
            loginForm.get('email')?.touched) {
            <div class="error-message">
              @if (loginForm.get('email')?.errors?.['required']) {
              <span>Email is required</span>
              } @if (loginForm.get('email')?.errors?.['email']) {
              <span>Please enter a valid email</span>
              }
            </div>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              formControlName="password"
              type="password"
              placeholder="Enter your password"
              [class.invalid]="
                loginForm.get('password')?.invalid &&
                loginForm.get('password')?.touched
              "
            />
            @if (loginForm.get('password')?.invalid &&
            loginForm.get('password')?.touched) {
            <div class="error-message">
              <span>Password is required</span>
            </div>
            }
          </div>

          <button
            type="submit"
            class="login-button"
            [disabled]="loading || loginForm.invalid"
          >
            @if (loading) {
            <span class="spinner"></span>
            }
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          @if (error) {
          <div class="error-message server-error">{{ error }}</div>
          }
        </form>

        <div class="signup-link">
          Don't have an account?
          <a [routerLink]="['/register']" routerLinkActive="active">Sign up</a>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {
    this.router.events.subscribe((event) => {
      console.log('Router event:', event);
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = '';

    this.auth
      .login(this.loginForm.value.email!, this.loginForm.value.password!)
      .subscribe({
        next: () => this.router.navigate(['/search']),
        error: (err) => {
          this.error =
            err.error.message || 'Login failed. Please check your credentials.';
          this.loading = false;
        },
      });
  }
}
