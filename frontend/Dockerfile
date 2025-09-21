# 🎬 Cine Gama Frontend - Dockerfile
# Optimized for IBM Cloud Code Engine deployment

FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy static files directly
COPY . /usr/share/nginx/html

# Remove nginx.conf and Dockerfile from served files
RUN rm -f /usr/share/nginx/html/nginx.conf /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/README.md

# Create log directory with proper permissions
RUN mkdir -p /var/log/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chmod -R 755 /var/log/nginx

# Set proper permissions for nginx files
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 8080

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Labels for metadata
LABEL maintainer="sergiogama@cinegama.com.br"
LABEL version="1.0"
LABEL description="Cine Gama Frontend - Static website with Watson Orchestrate integration"

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]