# syntax=docker/dockerfile:1
# ==============================================================================
# Multi-Stage Production Dockerfile for CampusSphere Client (React 19 + Vite)
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend Assets
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install exact dependencies
RUN npm ci || npm install

# Copy source code and build production bundle
COPY . .
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: High-Performance Alpine Nginx Web Server
# ------------------------------------------------------------------------------
FROM nginx:1.25-alpine AS runner

# Remove default boilerplate configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom Nginx SPA and reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Healthcheck probe checking web server responsiveness
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
