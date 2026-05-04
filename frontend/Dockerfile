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

# Copy the rest of your source code
# MAGIC TRICK: This step copies the temporary .env file that Jenkins just created!
COPY . .

# Vite automatically finds the .env file and bakes the Supabase keys into the code
RUN pnpm build

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled React app from the builder stage
# NOTE: Make sure your Vite build output folder is actually "dist". 
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]