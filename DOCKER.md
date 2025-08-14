# Docker Containerization Guide

This document explains how to run the AI Agent App frontend using Docker containers.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### Option 1: Production Build

```bash
# Build and run the production container
npm run docker:build
npm run docker:run

# Or use Docker Compose
npm run docker:prod
```

The application will be available at `http://localhost:4200`

### Option 2: Development Mode

```bash
# Run in development mode with hot reload
npm run docker:dev
```

This will start the development server with live reloading.

## Manual Docker Commands

### Build the Image

```bash
docker build -t ai-agent-app .
```

### Run the Container

```bash
# Production mode
docker run -p 4200:80 ai-agent-app

# With environment variables
docker run -p 4200:80 -e NODE_ENV=production ai-agent-app
```

### Using Docker Compose

```bash
# Start frontend service
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f frontend
```

## Container Details

### Production Container
- **Base Image**: `nginx:alpine`
- **Port**: 80 (mapped to 4200 on host)
- **Size**: Optimized multi-stage build
- **Features**: 
  - Gzip compression
  - Static asset caching
  - Security headers
  - Angular routing support

### Development Container
- **Base Image**: `node:20-alpine`
- **Port**: 4200
- **Features**:
  - Hot reload
  - Volume mounting for live changes
  - Full development tools

## Environment Configuration

### Production Environment Variables
- `NODE_ENV=production`

### Development Environment Variables
- `NODE_ENV=development`
- `CHOKIDAR_USEPOLLING=true` (for file watching in containers)

## Backend Integration

This frontend container is designed to work with your separate backend project. You can:

1. **Development**: Use the mock data service (already configured)
2. **Production**: Connect to your external backend by:
   - Setting `useMockData = false` in `StoryService`
   - Configuring proxy settings in `proxy.conf.json`
   - Or adding nginx proxy configuration for your backend URL

## Troubleshooting

### Port Already in Use
```bash
# Find and kill processes using port 4200
netstat -ano | findstr :4200
taskkill /PID <PID> /F
```

### Container Won't Start
```bash
# Check container logs
docker logs <container-name>

# Check running containers
docker ps -a

# Remove stopped containers
docker container prune
```

### Build Issues
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t ai-agent-app .
```

## Customization

### Custom Nginx Configuration
Edit `nginx.conf` to modify server settings or add proxy configuration for your backend.

### Different Port
Change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Use port 8080 instead of 4200
```

### Connecting to External Backend
To connect to your separate backend project:

1. Update `environment.ts` with your backend URL
2. Set `useMockData = false` in `StoryService`  
3. Configure CORS on your backend to allow requests from the frontend origin

## Performance Optimization

The production container includes:
- Multi-stage build for smaller image size
- Gzip compression
- Static asset caching
- Optimized Angular build
- Security headers

## Security

The container includes basic security headers:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
