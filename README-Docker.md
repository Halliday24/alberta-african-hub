# Docker Setup for Alberta African Hub

This document describes the Docker configuration for the Alberta African Hub project.

## Current Docker Files

### Root Directory
- `docker-compose.yml` - Main orchestration file for all services

### Backend (`reddit-africa-backend/`)
- `Dockerfile` - Production Dockerfile for the Node.js backend

### Frontend (`frontend/frontend/`)
- `Dockerfile` - Multi-stage Dockerfile for React app with Nginx
- `nginx.conf` - Nginx configuration for serving the React app

## Quick Start

1. **Prerequisites:**
   - Docker and Docker Compose installed
   - `.env` file in the root directory (see Environment Variables section)

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## Services Overview

### MongoDB Database
- **Image:** `mongo:6.0`
- **Port:** 27017
- **Volume:** `mongodb_data` for data persistence
- **Health Check:** MongoDB ping command

### Backend API
- **Build Context:** `./reddit-africa-backend`
- **Port:** 5000
- **Dependencies:** MongoDB (waits for healthy status)
- **Health Check:** HTTP GET to `/api/health`

### Frontend React App
- **Build Context:** `./frontend/frontend`
- **Port:** 3000
- **Dependencies:** Backend (waits for healthy status)
- **Served by:** Nginx with custom configuration
- **Health Check:** HTTP GET to `/health`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Node Environment
NODE_ENV=production

# Ports
PORT=5000

# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password
MONGO_DATABASE=african_community

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Frontend API URL
REACT_APP_API_URL=http://localhost:5000
```

## Docker Commands

### Basic Operations
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs frontend
docker-compose logs backend
docker-compose logs mongodb

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Building
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build backend

# Build without cache
docker-compose build --no-cache
```

### Status and Health
```bash
# Check service status
docker-compose ps

# Check service health
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```

## Production Considerations

### Security
- Change default MongoDB credentials
- Use strong JWT secrets
- Configure proper CORS origins
- Set appropriate rate limits

### Performance
- Configure MongoDB memory limits
- Optimize Nginx settings
- Use production Node.js settings

### Monitoring
- Health checks are configured for all services
- Logs are available via `docker-compose logs`
- Consider adding monitoring tools

## Troubleshooting

### Common Issues

1. **Frontend not starting:**
   - Check nginx configuration
   - Verify build process completed
   - Check logs: `docker-compose logs frontend`

2. **Backend not connecting to database:**
   - Verify MongoDB is running
   - Check connection string in environment variables
   - Check logs: `docker-compose logs backend`

3. **Port conflicts:**
   - Ensure ports 3000 and 5000 are available
   - Modify ports in docker-compose.yml if needed

### Logs and Debugging
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
```

## Access Points

- **Frontend Application:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health
- **Frontend Health:** http://localhost:3000/health 