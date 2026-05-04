# ==========================================
# Stage 1: Build the UI using pnpm
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the code and build the production assets
COPY . .
RUN pnpm build

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
FROM nginx:alpine
# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled React app from the builder stage
# NOTE: If you use Create React App, change "dist" to "build" below.
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration if routing is needed (optional, but good for React Router)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]