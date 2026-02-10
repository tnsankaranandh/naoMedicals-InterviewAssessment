# Multi-stage Docker build for both Frontend and Backend

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend . 

RUN npm run build

# Stage 2: Build Backend with served Frontend
FROM node:18-alpine

WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy backend source code
COPY backend/src ./src

# Copy backend config
COPY backend/gruntfile.js ./

# Create necessary directories
RUN mkdir -p uploads/audio

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/build ./public

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000', (r) => {if (r.statusCode !== 404) throw new Error(r.statusCode)})"

# Set environment
ENV NODE_ENV=production

# Start the backend server
CMD ["node", "src/server.js"]
