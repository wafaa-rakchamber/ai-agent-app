# Postman Collection for Project Management API with Authentication

This directory contains Postman collection and environment files for testing the Project Management API with JWT authentication.

## Files

- `Project-Management-API-with-Auth.postman_collection.json` - Complete API collection with authentication
- `Development.postman_environment.json` - Environment variables with auth token storage
- `Project-Management-API.postman_collection.json` - Legacy collection (without auth)

## How to Import

### Option 1: Import Files
1. Open Postman
2. Click "Import" button
3. Select both JSON files from this directory
4. Set "Development" as your active environment

## Environment Variables

- `baseUrl`: http://localhost:3000 (for local Docker setup)
- `authToken`: JWT token (automatically set after login/register)
- `userId`: Current user ID (automatically set after login/register)

## Authentication Flow

### 1. Register or Login
- Use **Register User** or **Login User** requests
- Token and userId are automatically saved to environment variables
- All subsequent requests will use the saved token

### 2. Test Protected Endpoints
- All CRUD operations now require authentication
- The `{{authToken}}` variable is automatically included in Authorization headers

## Collection Structure

### Authentication Endpoints
- **POST** `/api/auth/register` - Register new user (auto-saves token)
- **POST** `/api/auth/login` - Login user (auto-saves token)  
- **GET** `/api/auth/profile` - Get current user profile
- **POST** `/api/auth/refresh` - Refresh JWT token
- **POST** `/api/auth/logout` - Logout instruction

### Protected CRUD Operations
All endpoints now require `Authorization: Bearer {{authToken}}` header:

#### Users (Restricted)
- **GET** `/api/users` - Get all users (limited info)
- **GET** `/api/users/:id` - Get user profile
- **PUT** `/api/users/:id` - Update own profile only
- **DELETE** `/api/users/:id` - Delete own account only

#### Projects (Protected)
- **GET** `/api/projects` - Get all projects
- **POST** `/api/projects` - Create new project
- **GET** `/api/projects/:id` - Get project details
- **PUT** `/api/projects/:id` - Update project
- **DELETE** `/api/projects/:id` - Delete project

#### Stories (Protected)
- **GET** `/api/stories` - Get all stories
- **POST** `/api/stories` - Create new story
- **GET** `/api/stories/:id` - Get story details
- **PUT** `/api/stories/:id` - Update story
- **DELETE** `/api/stories/:id` - Delete story

#### Tasks (Protected)
- **GET** `/api/tasks` - Get all tasks
- **POST** `/api/tasks` - Create new task
- **GET** `/api/tasks/:id` - Get task details
- **PUT** `/api/tasks/:id` - Update task
- **DELETE** `/api/tasks/:id` - Delete task

#### Logging Hours (User-Scoped)
- **GET** `/api/logginghours` - Get current user's logged hours only
- **POST** `/api/logginghours` - Log hours (userId auto-set to current user)
- **GET** `/api/logginghours/:id` - Get own logging entry
- **PUT** `/api/logginghours/:id` - Update own logging entry
- **DELETE** `/api/logginghours/:id` - Delete own logging entry

## Quick Start Guide

1. **Start the API:**
   ```powershell
   docker compose up -d
   docker compose exec api npm run seed
   ```

2. **Import collection and environment**

3. **Test authentication:**
   - Try "Login User" with: `alice@company.com` / `password123`
   - Token will be automatically saved

4. **Test protected endpoints:**
   - Try "Get All Projects" - should work with valid token
   - Try any endpoint without logging in first - should get 401 error

## Security Features

- **JWT Authentication**: All protected routes require valid JWT token
- **Rate Limiting**: Auth endpoints limited to 5 attempts per 15 minutes
- **Password Hashing**: Passwords stored as bcrypt hashes
- **User Scoping**: Users can only access their own logging hours
- **Resource Protection**: Users can only modify their own profiles

## Sample Test Users (from seed data)

- **alice@company.com** / password123
- **bob@company.com** / password123  
- **carol@company.com** / password123
- **david@company.com** / password123
- **emma@company.com** / password123

## Token Management

- **Token Expiry**: 24 hours (configurable)
- **Auto-refresh**: Use "Refresh Token" endpoint
- **Logout**: Client-side token removal

## Error Responses

- **401 Unauthorized**: Missing or invalid token
- **403 Forbidden**: Valid token but insufficient permissions
- **429 Too Many Requests**: Rate limit exceeded
- **400 Bad Request**: Invalid input data
