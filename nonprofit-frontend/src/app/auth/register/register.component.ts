import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  styleUrls: ['./register.component.scss'],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Create Account</h2>
        <p class="subtitle">Please enter your details to register</p>

        <form
          (ngSubmit)="onSubmit()"
          [formGroup]="registerForm"
          class="login-form"
        >
          <div class="form-group">
            <label for="fullName">Ful Name</label>
            <input
              id="fullName"
              formControlName="fullName"
              type="fullName"
              placeholder="Enter your Full Name"
              [class.invalid]="
                registerForm.get('fullName')?.invalid &&
                registerForm.get('fullName')?.touched
              "
            />
            @if (registerForm.get('fullName')?.invalid &&
            registerForm.get('fullName')?.touched) {
            <div class="error-message">
              @if (registerForm.get('fullName')?.errors?.['required']) {
              <span>Full name is required</span>
              } @if (registerForm.get('fullName')?.errors?.['fullName']) {
              <span>Please enter a valid full name</span>
              }
            </div>
            }
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              formControlName="email"
              type="email"
              placeholder="Enter your email"
              [class.invalid]="
                registerForm.get('email')?.invalid &&
                registerForm.get('email')?.touched
              "
            />
            @if (registerForm.get('email')?.invalid &&
            registerForm.get('email')?.touched) {
            <div class="error-message">
              @if (registerForm.get('email')?.errors?.['required']) {
              <span>Email is required</span>
              } @if (registerForm.get('email')?.errors?.['email']) {
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
              placeholder="Create a password (min 6 characters)"
              [class.invalid]="
                registerForm.get('password')?.invalid &&
                registerForm.get('password')?.touched
              "
            />
            @if (registerForm.get('password')?.invalid &&
            registerForm.get('password')?.touched) {
            <div class="error-message">
              @if (registerForm.get('password')?.errors?.['required']) {
              <span>Password is required</span>
              } @if (registerForm.get('password')?.errors?.['minlength']) {
              <span>Password must be at least 6 characters</span>
              }
            </div>
            }
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              formControlName="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              [class.invalid]="
                registerForm.get('confirmPassword')?.invalid ||
                registerForm.hasError('passwordMismatch')
              "
            />
            @if (registerForm.get('confirmPassword')?.invalid ||
            registerForm.hasError('passwordMismatch')) {
            <div class="error-message">
              <span>Passwords must match</span>
            </div>
            }
          </div>

          <button
            type="submit"
            class="login-button"
            [disabled]="loading || registerForm.invalid"
          >
            @if (loading) {
            <span class="spinner"></span>
            }
            {{ loading ? 'Creating account...' : 'Register' }}
          </button>

          @if (error) {
          <div class="error-message server-error">{{ error }}</div>
          }
        </form>

        <div class="signup-link">
          Already have an account? <a routerLink="/login">Log in</a>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      fullName: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: this.passwordMatchValidator }
  );

  loading = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const formGroup = control as FormGroup;
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = '';

    this.auth
      .register(
        {
          email: this.registerForm.value.email! as string,
          password: this.registerForm.value.password!,
          fullName: this.registerForm.value.fullName!,
        },
        this.registerForm.value.password!,
        ''
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Registration failed';
          this.loading = false;
        },
      });
  }
}
