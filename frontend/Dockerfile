# 🎬 Cine Gama Frontend - Dockerfile
# Optimized for IBM Cloud Code Engine deployment

FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files directly
COPY index.html /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

# Create a simple health check file
RUN echo "healthy" > /usr/share/nginx/html/health

# Set proper permissions
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