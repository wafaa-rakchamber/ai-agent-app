import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ApiTestService } from '../services/api-test.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="header-content">
          <h1>Dashboard</h1>
          <div class="user-info">
            @if (user(); as currentUser) {
              <span class="welcome">Welcome, {{ currentUser.name }}!</span>
              <span class="email">{{ currentUser.email }}</span>
            }
            <button (click)="logout()" class="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main class="dashboard-content">
        <div class="content-grid">
          <div class="card">
            <h3>Authentication Status</h3>
            <div class="status-info">
              <div class="status-item">
                <strong>Status:</strong> 
                <span class="status-badge authenticated">Authenticated</span>
              </div>
              @if (user(); as currentUser) {
                <div class="status-item">
                  <strong>User ID:</strong> {{ currentUser.id }}
                </div>
                <div class="status-item">
                  <strong>Name:</strong> {{ currentUser.name }}
                </div>
                <div class="status-item">
                  <strong>Email:</strong> {{ currentUser.email }}
                </div>
              }
              @if (token()) {
                <div class="status-item">
                  <strong>Token:</strong> 
                  <code class="token-preview">{{ tokenPreview() }}</code>
                </div>
              }
            </div>
          </div>

          <div class="card">
            <h3>API Testing</h3>
            <div class="api-testing">
              <p>Test your authenticated API endpoints:</p>
              <div class="test-buttons">
                <button 
                  (click)="testHealthCheck()" 
                  [disabled]="isTestingHealth()"
                  class="test-button health"
                >
                  @if (isTestingHealth()) {
                    <span class="loading-spinner"></span>
                  }
                  Test Health Check
                </button>
                
                <button 
                  (click)="testUserProfile()" 
                  [disabled]="isTestingProfile()"
                  class="test-button profile"
                >
                  @if (isTestingProfile()) {
                    <span class="loading-spinner"></span>
                  }
                  Test User Profile
                </button>
                
                <button 
                  (click)="testProjects()" 
                  [disabled]="isTestingProjects()"
                  class="test-button projects"
                >
                  @if (isTestingProjects()) {
                    <span class="loading-spinner"></span>
                  }
                  Test Projects API
                </button>
              </div>
              
              @if (testResults()) {
                <div class="test-results">
                  <h4>Test Results:</h4>
                  <pre>{{ testResults() }}</pre>
                </div>
              }
            </div>
          </div>

          <div class="card">
            <h3>Available Features</h3>
            <div class="features-list">
              <button class="feature-button" (click)="navigateToProjects()">
                <span class="feature-icon">📊</span>
                <span class="feature-text">Projects Management</span>
              </button>
              <button class="feature-button" disabled>
                <span class="feature-icon">🚀</span>
                <span class="feature-text">Fast & Modern - Built with Angular 20 for optimal performance</span>
              </button>
              <button class="feature-button" (click)="navigateToTodo()">
                <span class="feature-icon">📝</span>
                <span class="feature-text">Todo App</span>
              </button>
              <button class="feature-button" (click)="navigateToHello()">
                <span class="feature-icon">👋</span>
                <span class="feature-text">Hello Component</span>
              </button>
              <button class="feature-button" (click)="navigateToUsers()">
                <span class="feature-icon">👥</span>
                <span class="feature-text">Users Management</span>
              </button>
              <button class="feature-button" disabled>
                <span class="feature-icon">🏗️</span>
                <span class="feature-text">More features coming soon...</span>
              </button>
            </div>
          </div>

          <div class="card">
            <h3>API Information</h3>
            <div class="api-info">
              <div class="api-item">
                <strong>Base URL:</strong> {{ apiBaseUrl }}
              </div>
              <div class="api-item">
                <strong>Auth Endpoint:</strong> {{ authEndpoint }}
              </div>
              <div class="api-item">
                <strong>Projects Endpoint:</strong> {{ projectsEndpoint }}
              </div>
              <div class="api-item">
                <strong>Token Type:</strong> Bearer
              </div>
              <div class="api-item">
                <strong>Token Storage:</strong> localStorage
              </div>
              <div class="api-item">
                <strong>Environment:</strong> {{ environment }}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule]
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly apiTestService = inject(ApiTestService);
  private readonly router = inject(Router);

  readonly auth = this.authService.auth;
  readonly user = computed(() => this.auth().user);
  readonly token = computed(() => this.auth().token);
  readonly tokenPreview = computed(() => {
    const token = this.token();
    return token ? `${token.substring(0, 20)}...` : '';
  });

  // Environment-based computed properties
  readonly apiBaseUrl = environment.apiUrl;
  readonly authEndpoint = `${environment.apiUrl}${environment.apiEndpoints.auth}/login`;
  readonly projectsEndpoint = `${environment.apiUrl}${environment.apiEndpoints.projects}`;
  readonly environment = environment.production ? 'Production' : 'Development';

  // Test states
  readonly isTestingHealth = signal(false);
  readonly isTestingProfile = signal(false);
  readonly isTestingProjects = signal(false);
  readonly testResults = signal('');

  logout(): void {
    this.authService.logout();
  }

  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

  navigateToTodo(): void {
    this.router.navigate(['/todo']);
  }

  navigateToHello(): void {
    this.router.navigate(['/hello']);
  }

  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  testHealthCheck(): void {
    this.isTestingHealth.set(true);
    this.testResults.set('');
    
    this.apiTestService.healthCheck().subscribe({
      next: (response) => {
        this.testResults.set(`✅ Health Check Success:\n${JSON.stringify(response, null, 2)}`);
        this.isTestingHealth.set(false);
      },
      error: (error) => {
        this.testResults.set(`❌ Health Check Failed:\n${JSON.stringify(error.error || error.message, null, 2)}`);
        this.isTestingHealth.set(false);
      }
    });
  }

  testUserProfile(): void {
    this.isTestingProfile.set(true);
    this.testResults.set('');
    
    this.apiTestService.getUserProfile().subscribe({
      next: (response) => {
        this.testResults.set(`✅ Profile API Success:\n${JSON.stringify(response, null, 2)}`);
        this.isTestingProfile.set(false);
      },
      error: (error) => {
        this.testResults.set(`❌ Profile API Failed:\n${JSON.stringify(error.error || error.message, null, 2)}`);
        this.isTestingProfile.set(false);
      }
    });
  }

  testProjects(): void {
    this.isTestingProjects.set(true);
    this.testResults.set('');
    
    this.apiTestService.getProjects().subscribe({
      next: (response) => {
        this.testResults.set(`✅ Projects API Success:\n${JSON.stringify(response, null, 2)}`);
        this.isTestingProjects.set(false);
      },
      error: (error) => {
        this.testResults.set(`❌ Projects API Failed:\n${JSON.stringify(error.error || error.message, null, 2)}`);
        this.isTestingProjects.set(false);
      }
    });
  }
}
