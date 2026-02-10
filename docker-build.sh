#!/bin/bash

# Simple Docker build and run script for the root-level Dockerfile

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🐳 NAO Medicals - Docker Build & Deploy Script${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Build the image
echo -e "${YELLOW}📦 Building Docker image...${NC}"
docker build -t nao-medicals:latest .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Image built successfully!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Run the container
echo -e "${YELLOW}🚀 Starting container...${NC}"

docker run -d \
  --name nao-medicals \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PORT=5000 \
  -e MONGODB_URI=${MONGODB_URI:-mongodb://localhost:27017/healthcare-chat} \
  -e JWT_SECRET=${JWT_SECRET:-change-me-in-production} \
  -e GOOGLE_GENAI_API_KEY=${GOOGLE_GENAI_API_KEY} \
  -v $(pwd)/backend/uploads:/app/uploads \
  nao-medicals:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Container started successfully!${NC}"
    echo ""
    echo -e "${GREEN}🌐 Application is running at:${NC}"
    echo "   Frontend & Backend: http://localhost:5000"
    echo ""
    echo -e "${YELLOW}📋 Useful commands:${NC}"
    echo "   View logs: docker logs -f nao-medicals"
    echo "   Stop container: docker stop nao-medicals"
    echo "   Remove container: docker rm nao-medicals"
    echo "   Remove image: docker rmi nao-medicals:latest"
else
    echo -e "${RED}❌ Failed to start container!${NC}"
    exit 1
fi
