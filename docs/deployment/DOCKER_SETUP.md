# Docker Setup Guide

This guide explains how to set up and run the Personal Finance Tracker project using Docker.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd personal-finance-tracker
```

### 2. Set Up Environment Variables
```bash
cp env.example .env
# Edit .env with your configuration
```

### 3. Run the Application

#### Development Mode
```bash
# Start all services in development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Or start specific services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up db redis backend-dev frontend-dev
```

#### Production Mode
```bash
# Start all services in production mode
docker-compose up --build

# Or start with nginx reverse proxy
docker-compose --profile production up --build
```

## Service Architecture

### Services Overview

| Service | Port | Description |
|---------|------|-------------|
| `db` | 5432 | PostgreSQL database |
| `redis` | 6379 | Redis cache |
| `backend` | 8000 | Django REST API |
| `frontend` | 3000 | React frontend |
| `nginx` | 80/443 | Reverse proxy (production) |

### Development vs Production

#### Development Mode
- Hot reloading enabled
- Debug mode active
- Volume mounts for live code changes
- Development-specific configurations

#### Production Mode
- Optimized builds
- Static file serving
- Production-grade web server (Gunicorn)
- Nginx reverse proxy

## Environment Variables

### Required Variables
```bash
SECRET_KEY=your-secret-key-here
POSTGRES_DB=finance_db
POSTGRES_USER=finance_user
POSTGRES_PASSWORD=finance_password
```

### Optional Variables
```bash
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
REACT_APP_API_URL=http://localhost:8000
```

## Docker Commands

### Basic Commands
```bash
# Build images
docker-compose build

# Start services
docker-compose up

# Start services in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs backend
```

### Development Commands
```bash
# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Run Django management commands
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser

# Access Django shell
docker-compose exec backend python manage.py shell

# Run tests
docker-compose exec backend python manage.py test
```

### Database Commands
```bash
# Access PostgreSQL
docker-compose exec db psql -U finance_user -d finance_db

# Create database backup
docker-compose exec db pg_dump -U finance_user finance_db > backup.sql

# Restore database
docker-compose exec -T db psql -U finance_user -d finance_db < backup.sql
```

## Health Checks

All services include health checks:

- **Database**: Checks PostgreSQL connectivity
- **Redis**: Pings Redis server
- **Backend**: Calls `/health/` endpoint
- **Frontend**: Checks nginx health endpoint

## Troubleshooting

### Common Issues

#### Port Conflicts
If ports are already in use:
```bash
# Check what's using the port
lsof -i :8000

# Use different ports in docker-compose.yml
ports:
  - "8001:8000"  # Map host port 8001 to container port 8000
```

#### Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Or run with proper user
docker-compose run --user $(id -u):$(id -g) backend python manage.py migrate
```

#### Database Connection Issues
```bash
# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db

# Reset database (WARNING: This will delete all data)
docker-compose down -v
docker-compose up db
```

### Logs and Debugging
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh
```

## Production Deployment

### 1. Environment Setup
```bash
# Set production environment variables
export DEBUG=False
export SECRET_KEY=your-production-secret-key
export ALLOWED_HOSTS=your-domain.com
```

### 2. Build and Deploy
```bash
# Build production images
docker-compose build

# Start production services
docker-compose --profile production up -d
```

### 3. SSL/HTTPS Setup
```bash
# Create SSL certificates
mkdir -p nginx/ssl
# Add your SSL certificates to nginx/ssl/

# Update nginx configuration for HTTPS
# Edit nginx/nginx.conf
```

### 4. Monitoring
```bash
# Check service status
docker-compose ps

# Monitor resource usage
docker stats

# View health check status
docker-compose exec backend curl http://localhost:8000/health/
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **Secrets**: Use Docker secrets or external secret management
3. **Network**: Use internal Docker networks
4. **Updates**: Regularly update base images and dependencies
5. **Backups**: Implement regular database backups

## Performance Optimization

1. **Multi-stage Builds**: Used in Dockerfiles for smaller images
2. **Caching**: Implement Redis for session and cache storage
3. **Static Files**: Serve static files through nginx
4. **Database**: Use connection pooling and proper indexing
5. **Monitoring**: Implement application monitoring and logging

## Contributing

When contributing to the Docker setup:

1. Test both development and production configurations
2. Update documentation for any changes
3. Ensure backward compatibility
4. Add appropriate health checks
5. Follow security best practices 