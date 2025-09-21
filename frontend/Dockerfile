# 🎬 Cine Gama Frontend - Dockerfile
# Multi-stage build for optimized production deployment

# Stage 1: Build stage (prepare static files)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy frontend files
COPY . .

# Install serve for local testing (optional)
RUN npm install -g serve

# Stage 2: Production stage with nginx
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files from build stage
COPY --from=builder /app /usr/share/nginx/html

# Create log directory
RUN mkdir -p /var/log/nginx

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html
RUN chown -R nginx:nginx /var/log/nginx

# Expose port
EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/ || exit 1

# Labels for metadata
LABEL maintainer="sergiogama@cinegama.com.br"
LABEL version="1.0"
LABEL description="Cine Gama Frontend - Static website with Watson Orchestrate integration"

# Start nginx
CMD ["nginx", "-g", "daemon off;"]