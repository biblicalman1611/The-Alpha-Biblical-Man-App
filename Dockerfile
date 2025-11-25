# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Declare build arguments early
ARG VITE_GEMINI_API_KEY
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG POSTGRES_URL

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code (note: .env is excluded via .dockerignore)
COPY . .

# Delete any .env files that might have been copied (safety measure)
RUN rm -f .env .env.local .env.*.local

# Set environment variables from build args
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV POSTGRES_URL=$POSTGRES_URL

# Debug: Verify environment variables are set correctly
RUN echo "=== BUILD ENVIRONMENT DEBUG ===" && \
    echo "VITE_GEMINI_API_KEY length: $(echo -n "$VITE_GEMINI_API_KEY" | wc -c)" && \
    echo "VITE_GEMINI_API_KEY prefix: ${VITE_GEMINI_API_KEY:0:15}..." && \
    echo "VITE_FIREBASE_API_KEY length: $(echo -n "$VITE_FIREBASE_API_KEY" | wc -c)" && \
    echo "All VITE_ env vars:" && env | grep VITE_ | sed 's/=.*/=***/' && \
    echo "=== END DEBUG ==="

# Build the app with Vite (will use ENV vars, not .env file)
RUN npm run build

# Debug: Check what got baked into the bundle
RUN echo "=== BUNDLE DEBUG ===" && \
    grep -r "AIzaSy" dist/ | head -5 || echo "No API keys found in bundle (good if using runtime config)" && \
    echo "=== END BUNDLE DEBUG ==="

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Remove default nginx config and copy our custom configuration
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
