import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly config = environment;

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get apiEndpoints() {
    return this.config.apiEndpoints;
  }

  get authConfig() {
    return this.config.auth;
  }

  get appConfig() {
    return this.config.app;
  }

  get isProduction(): boolean {
    return this.config.production;
  }

  get isDevelopment(): boolean {
    return !this.config.production;
  }

  /**
   * Get full API endpoint URL
   */
  getApiEndpoint(endpoint: keyof typeof this.config.apiEndpoints): string {
    return `${this.config.apiUrl}${this.config.apiEndpoints[endpoint]}`;
  }

  /**
   * Get environment info for debugging
   */
  getEnvironmentInfo() {
    return {
      production: this.config.production,
      apiUrl: this.config.apiUrl,
      appName: this.config.app.name,
      appVersion: this.config.app.version
    };
  }

  /**
   * Validate environment configuration
   */
  validateConfig(): boolean {
    if (!this.config.apiUrl) {
      console.error('API URL is not configured');
      return false;
    }

    if (!this.config.apiEndpoints.auth) {
      console.error('Auth endpoint is not configured');
      return false;
    }

    if (!this.config.apiEndpoints.projects) {
      console.error('Projects endpoint is not configured');
      return false;
    }

    return true;
  }
}
