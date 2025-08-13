# Environment Configuration Guide

This application uses environment-based configuration to support different deployment environments and avoid hardcoded URLs.

## Environment Files

### Development Environment (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
  // ... other config
};
```

### Production Environment (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com',
  // ... other config
};
```

## Configuration Structure

The environment configuration includes:

- **`apiUrl`**: Base URL for the API server
- **`apiEndpoints`**: Object containing all API endpoint paths
- **`app`**: Application metadata (name, version)
- **`auth`**: Authentication configuration (token keys, expiry)

## Usage in Services

Services use the environment configuration like this:

```typescript
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SomeService {
  private readonly apiUrl = environment.apiUrl;
  private readonly authEndpoint = `${environment.apiUrl}${environment.apiEndpoints.auth}`;
}
```

## Available Scripts

### Development
```bash
npm start              # Start with development proxy
npm run start:dev      # Explicit development start
npm run build:dev      # Build for development
```

### Production
```bash
npm run start:prod     # Start with production proxy
npm run build:prod     # Build for production
```

## Proxy Configuration

- **Development**: Uses `proxy.conf.dev.json` (points to localhost:3000)
- **Production**: Uses `proxy.conf.prod.json` (points to production API)

## Security Benefits

✅ **No hardcoded URLs** in source code  
✅ **Environment-specific configuration**  
✅ **Easy deployment** to different environments  
✅ **Secure production builds**  
✅ **Configurable API endpoints**  
✅ **Centralized configuration management**  

## Deployment

### For Different Environments

1. **Staging**: Update `environment.prod.ts` with staging API URL
2. **Production**: Update `environment.prod.ts` with production API URL
3. **Docker**: Environment variables can override config values

### Environment Variables (Advanced)

For Docker deployments, you can use environment variables:

```dockerfile
ENV API_URL=https://api.yourcompany.com
ENV ENVIRONMENT=production
```

Then use build-time replacement or a config service that reads from `window` globals.

## Configuration Service

Use the `ConfigService` for centralized configuration management:

```typescript
constructor(private config: ConfigService) {}

// Get API endpoint
const authUrl = this.config.getApiEndpoint('auth');

// Check environment
if (this.config.isDevelopment) {
  console.log('Running in development mode');
}
```

## Best Practices

1. **Never commit sensitive data** to environment files
2. **Use different configurations** for each environment
3. **Validate configuration** on app startup
4. **Use the ConfigService** for accessing configuration
5. **Keep environment files in version control** (except sensitive prod values)
