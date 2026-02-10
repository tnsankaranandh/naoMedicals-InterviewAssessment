# Docker Deployment Guide

This guide explains how to deploy the nao-Medicals application using Docker.

## Prerequisites

- Docker Engine (version 20.10 or later)
- Docker Compose (version 1.29 or later)
- Git

## Quick Start with Docker Compose

The easiest way to deploy the entire stack (frontend, backend, and MongoDB) is using Docker Compose:

### 1. Clone the repository
```bash
git clone <repository-url>
cd naoMedicals-InterviewAssessment
```

### 2. Create environment file
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set your configuration values:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://mongo:27017/healthcare-chat
JWT_SECRET=your-secure-jwt-secret
GOOGLE_GENAI_API_KEY=your-api-key
```

### 3. Build and start the application
```bash
# Build all images and start services
docker-compose up --build

# Or run in background
docker-compose up -d
```

### 4. Verify services are running
```bash
docker-compose ps
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## Building Backend Docker Image Separately

If you only want to build and run the backend:

### 1. Build the image
```bash
cd backend
docker build -t nao-medicals-backend:latest .
```

### 2. Run the container
```bash
docker run -d \
  --name nao-medicals-backend \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e MONGODB_URI=mongodb://host.docker.internal:27017/healthcare-chat \
  -e JWT_SECRET=your-secret-key \
  -e GOOGLE_GENAI_API_KEY=your-api-key \
  -v $(pwd)/uploads:/app/uploads \
  nao-medicals-backend:latest
```

## Dockerfile Details

The Dockerfile includes:
- **Base Image**: Node.js 18 Alpine (lightweight)
- **Working Directory**: `/app`
- **Exposed Port**: 5000
- **Health Check**: Monitors container health every 30 seconds
- **Uploads Directory**: Creates `uploads/audio` directory for file storage

## Useful Docker Commands

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
```

### Stop services
```bash
docker-compose stop
```

### Remove everything (including volumes)
```bash
docker-compose down -v
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### Access container shell
```bash
docker-compose exec backend sh
```

## Production Deployment

For production deployment:

1. **Use environment-specific configs**: Create separate `.env.production` file
2. **Enable HTTPS**: Use reverse proxy (Nginx) with SSL certificates
3. **Persistent storage**: Mount external volumes for MongoDB data
4. **Resource limits**: Set memory and CPU limits in docker-compose.yml
5. **Logging**: Configure Docker logging drivers for centralized logging
6. **Network security**: Use private networks and firewalls

### Example production docker-compose override:
```bash
version: '3.8'
services:
  backend:
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

Save as `docker-compose.production.yml` and run:
```bash
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
```

## Troubleshooting

### Container exits immediately
- Check logs: `docker-compose logs backend`
- Verify environment variables are set correctly

### MongoDB connection error
- Ensure mongo service started: `docker-compose ps mongo`
- Check MongoDB URI in .env file

### Port already in use
- Change ports in docker-compose.yml or stop existing containers
- Find process: `lsof -i :5000`

### Permission denied for uploads
- Fix permissions: `docker-compose exec backend chmod -R 755 uploads`

## CI/CD Integration

For automated deployment, use:
- **GitHub Actions**: Build and push to registry on push
- **Docker Hub**: Automated builds from repository
- **AWS ECR, Google Container Registry**: For production deployments

## Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Node.js Docker Best Practices](https://nodejs.org/en/docs/guides/docker-and-nodejs/)
