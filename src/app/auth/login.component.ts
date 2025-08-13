import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Login</h2>
        <p class="subtitle">Sign in to access your account</p>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              [class.error]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              placeholder="Enter your email"
            />
            @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
              <div class="error-message">
                @if (loginForm.get('email')?.errors?.['required']) {
                  Email is required
                }
                @if (loginForm.get('email')?.errors?.['email']) {
                  Please enter a valid email
                }
              </div>
            }
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              [class.error]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
              placeholder="Enter your password"
            />
            @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
              <div class="error-message">
                Password is required
              </div>
            }
          </div>

          @if (errorMessage()) {
            <div class="alert error-alert">
              {{ errorMessage() }}
            </div>
          }

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading()"
            class="submit-button"
          >
            @if (isLoading()) {
              <span class="loading-spinner"></span>
              Signing in...
            } @else {
              Sign In
            }
          </button>
        </form>

        <div class="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Email:</strong> wafaa@rakchamber.ae</p>
          <p><strong>Password:</strong> password123</p>
          <button type="button" (click)="fillDemoCredentials()" class="demo-button">
            Use Demo Credentials
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading()) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const credentials: LoginRequest = this.loginForm.value;

      this.authService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isLoading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.isLoading.set(false);
          
          let errorMsg = 'Login failed. Please try again.';
          if (error.status === 401) {
            errorMsg = 'Invalid email or password.';
          } else if (error.status === 0) {
            errorMsg = 'Unable to connect to server. Please check your connection.';
          } else if (error.error?.message) {
            errorMsg = error.error.message;
          }
          
          this.errorMessage.set(errorMsg);
        }
      });
    }
  }

  fillDemoCredentials(): void {
    this.loginForm.patchValue({
      email: 'wafaa@rakchamber.ae',
      password: 'password123'
    });
  }
}
