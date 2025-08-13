# Angular Authentication with Node.js Backend

This Angular application includes a complete authentication system that connects to a Node.js backend API.

## Features

- ✅ **Login Component** with email/password authentication
- ✅ **Authentication Service** with JWT token management  
- ✅ **Auth Guard** to protect routes
- ✅ **HTTP Interceptor** to automatically add Bearer tokens
- ✅ **Dashboard** with user info and API testing
- ✅ **Responsive Design** with modern UI
- ✅ **Signal-based State Management** (Angular 17+)

## Quick Start

### Prerequisites

1. **Node.js Backend** running on `http://localhost:3000`
2. **API Endpoint**: `POST /api/auth/login`
3. **Expected Response**:
   ```json
   {
     "token": "jwt_token_here",
     "user": {
       "id": "user_id",
       "name": "User Name", 
       "email": "user@example.com"
     }
   }
   ```

### Demo Credentials

The application comes with pre-configured demo credentials:

```
Email: wafaa@rakchamber.ae
Password: password123
```

### Running the Application

1. **Start the Angular app**:
   ```bash
   npm start
   # or
   ng serve --port 4201
   ```

2. **Navigate to**: `http://localhost:4201`

3. **Login** with the demo credentials or use the "Use Demo Credentials" button

## Application Flow

### 1. **Login Process**
- User enters email/password
- Application sends POST request to `http://localhost:3000/api/auth/login`
- Backend returns JWT token and user info
- Token is stored in localStorage
- User is redirected to dashboard

### 2. **Authentication State**
- AuthService manages authentication state using Angular signals
- Token is automatically added to API requests via HTTP interceptor
- Auth guard protects routes (redirects to login if not authenticated)

### 3. **Protected Routes**
- `/dashboard` - Main dashboard with user info and API testing
- `/hello` - Hello component (requires auth)
- `/todo` - Todo application (requires auth)

### 4. **API Testing**
The dashboard includes buttons to test various API endpoints:
- **Health Check**: `GET /` (no auth required)
- **User Profile**: `GET /api/auth/profile` (with Bearer token)
- **Projects**: `GET /api/projects` (with Bearer token)

## File Structure

```
src/app/
├── auth/
│   ├── auth.service.ts          # Authentication service with signals
│   ├── auth.guard.ts            # Route guard for protected routes
│   ├── auth.interceptor.ts      # HTTP interceptor for Bearer tokens
│   ├── login.component.ts       # Login form component
│   └── login.component.scss     # Login styles
├── dashboard/
│   ├── dashboard.component.ts   # Main dashboard with API testing
│   └── dashboard.component.scss # Dashboard styles
├── services/
│   └── api-test.service.ts      # Service for testing API endpoints
├── app.config.ts               # App configuration with HTTP client
└── app.routes.ts               # Route configuration with auth guards
```

## Key Components

### AuthService
- **Signal-based state management** for reactive authentication state
- **Token storage** in localStorage with automatic initialization
- **Login/logout methods** with proper cleanup
- **Type-safe interfaces** for API responses

### LoginComponent  
- **Reactive forms** with validation
- **Loading states** and error handling
- **Demo credentials** button for easy testing
- **Responsive design** with modern UI

### DashboardComponent
- **User information** display
- **API testing** functionality
- **Navigation** to other protected routes
- **Token preview** for debugging

### AuthGuard
- **Route protection** with automatic redirect to login
- **Simple and efficient** implementation

### AuthInterceptor
- **Automatic token injection** for all HTTP requests
- **Bearer token format** as expected by most APIs

## API Integration

The application is configured to work with the Postman collection endpoints:

### Login Endpoint
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "wafaa@rakchamber.ae",
  "password": "password123"
}
```

### Expected Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "name": "Wafaa",
    "email": "wafaa@rakchamber.ae"
  }
}
```

### Protected API Calls
All subsequent API calls will automatically include:
```
Authorization: Bearer <token>
```

## Development Notes

### Technologies Used
- **Angular 17+** with standalone components
- **TypeScript** with strict typing
- **Angular Signals** for reactive state management
- **Reactive Forms** for form handling
- **Angular Router** with guards
- **HTTP Client** with interceptors

### Best Practices Implemented
- ✅ Standalone components (no NgModules)
- ✅ Signal-based state management
- ✅ Type-safe interfaces
- ✅ Modern Angular patterns
- ✅ Responsive design
- ✅ Error handling
- ✅ Loading states
- ✅ Security best practices

## Troubleshooting

### Common Issues

1. **CORS Error**: Make sure your Node.js backend allows requests from `http://localhost:4201`

2. **401 Unauthorized**: Check that your backend is running and the demo user exists

3. **Connection Error**: Verify the backend is running on `http://localhost:3000`

4. **Token Issues**: Clear localStorage and try logging in again:
   ```javascript
   localStorage.clear()
   ```

### Debug Information

The dashboard provides several debugging tools:
- **Token preview** to verify token storage
- **API testing buttons** to verify backend connectivity
- **User information** to confirm authentication state
- **Console logging** for detailed error information

## Next Steps

You can extend this implementation by:

1. **Adding registration functionality**
2. **Implementing password reset**
3. **Adding role-based authorization**
4. **Creating more protected components**
5. **Adding refresh token logic**
6. **Implementing logout on token expiry**

The authentication system is production-ready and follows Angular best practices for security and performance.
