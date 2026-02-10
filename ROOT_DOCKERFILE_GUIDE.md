# Root-Level Docker Deployment

The root-level `Dockerfile` creates a single unified container that runs both your frontend and backend together.

## How It Works

The root-level Dockerfile uses a **multi-stage build approach**:

1. **Stage 1 - Frontend Builder**: 
   - Builds the React frontend (`npm run build`)
   - Creates optimized static files

2. **Stage 2 - Backend with Frontend**:
   - Installs Node.js dependencies
   - Copies the backend source code
   - Copies the built frontend static files into the `public` folder
   - Serves both frontend and backend from a single Node.js server on port 5000

The backend's Express server serves:
- **Frontend**: All non-API routes serve the React app from `/public`
- **Backend API**: `/api/*` routes handled by Express routes
- **WebSocket**: Socket.io connections for real-time chat

## Quick Start

### Option 1: Using the Build Script (Easiest)

```bash
# Make the script executable
chmod +x docker-build.sh

# Run it
./docker-build.sh
```

### Option 2: Manual Build and Run

```bash
# Build the image
docker build -t nao-medicals:latest .

# Run the container
docker run -d \
  --name nao-medicals \
  -p 5000:5000 \
  -e MONGODB_URI=mongodb://localhost:27017/healthcare-chat \
  -e JWT_SECRET=your-secret-key \
  -e GOOGLE_GENAI_API_KEY=your-api-key \
  -v $(pwd)/backend/uploads:/app/uploads \
  nao-medicals:latest

# View logs
docker logs -f nao-medicals
```

### Option 3: Using Docker Desktop

1. Open Docker Desktop
2. Navigate to the root folder in terminal
3. Run: `docker build -t nao-medicals:latest .`
4. Click "Run" in Docker Desktop UI
5. Configure environment variables and port mapping (5000:5000)

## Environment Variables

When running the container, set these environment variables:

```bash
MONGODB_URI=mongodb://localhost:27017/healthcare-chat
JWT_SECRET=your-secure-secret-key
GOOGLE_GENAI_API_KEY=your-google-api-key
NODE_ENV=production
PORT=5000
```

## Access the Application

Once running, access your application at:

```
http://localhost:5000
```

Everything is served from this single URL:
- Frontend UI: `http://localhost:5000/`
- Backend API: `http://localhost:5000/api/*`
- Socket.io: Connected automatically via the same port

## Advantages of Root-Level Dockerfile

✅ **Single Container**: Simpler deployment, one image to manage  
✅ **Single Port**: No port mapping complexity  
✅ **No Network Issues**: Frontend and backend on same container  
✅ **Unified Logs**: All logs from one container  
✅ **Production Ready**: Optimized multi-stage build  
✅ **Small Image Size**: Only production dependencies, no build tools  

## Build Size Optimization

The Dockerfile uses:
- **Alpine Linux**: Minimal base image (~40MB)
- **Multi-stage build**: Build dependencies not included in final image
- **Production dependencies only**: `npm ci --only=production` excludes dev tools

Final image size: ~200-250MB (depending on dependencies)

## Using with Docker Compose

You can also override the docker-compose to use this single Dockerfile:

```bash
# For local development with MongoDB
docker-compose -f docker-compose.yml up

# For production with single image
docker build -t nao-medicals:latest .
docker run -p 5000:5000 -e MONGODB_URI=... nao-medicals:latest
```

## Stopping and Removing the Container

```bash
# Stop the container
docker stop nao-medicals

# Remove the container
docker rm nao-medicals

# Remove the image
docker rmi nao-medicals:latest

# Remove everything
docker system prune -a
```

## Troubleshooting

### Container exits immediately
```bash
docker logs nao-medicals
```
Check for missing environment variables or MongoDB connection errors.

### Cannot access the application
- Ensure port 5000 is not in use: `lsof -i :5000`
- Check container is running: `docker ps`
- Verify environment variables are set correctly

### MongoDB connection failed
- Ensure MongoDB is running on your machine
- Update MONGODB_URI if using remote MongoDB
- Use `host.docker.internal` instead of `localhost` for Mac/Windows

### File permission issues with uploads
```bash
docker exec -it nao-medicals chmod -R 755 /app/uploads
```

## Performance Tips

1. **Use named volumes** for persistent uploads:
   ```bash
   docker volume create nao-medicals-uploads
   docker run -v nao-medicals-uploads:/app/uploads ...
   ```

2. **Limit resources** to prevent memory issues:
   ```bash
   docker run -m 512m --cpus="1" ...
   ```

3. **Use health checks** to auto-restart failed containers:
   ```bash
   docker run --health-cmd="curl localhost:5000" ...
   ```

## Advanced: Build Arguments

You can customize the build with build arguments:

```bash
docker build \
  --build-arg NODE_ENV=production \
  --build-arg NPM_INSTALL_ARGS="--production" \
  -t nao-medicals:latest .
```

## Next Steps

- Deploy to **Docker Hub** or private registry
- Use Docker in **cloud platforms** (AWS ECS, Google Cloud Run, Azure Container Instances)
- Set up **CI/CD pipeline** (GitHub Actions, GitLab CI) to auto-build on commits
- Use **Kubernetes** for orchestration and scaling
