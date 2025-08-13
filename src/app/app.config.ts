import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthInterceptor } from './auth/auth.interceptor';
import { environment } from '../environments/environment';

// Validate environment configuration on app startup
function validateEnvironment() {
  if (!environment.apiUrl) {
    console.error('❌ API URL is not configured in environment');
  } else {
    console.log(`🌍 Environment: ${environment.production ? 'Production' : 'Development'}`);
    console.log(`🔗 API URL: ${environment.apiUrl}`);
  }
}

// Run validation
validateEnvironment();

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
};
