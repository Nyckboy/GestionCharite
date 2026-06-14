# ==========================================
# Stage 1: Build the UI using pnpm
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Set up pnpm environment variables for caching
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# 1. Open the gates to accept variables from Docker Compose
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_STRIPE_PUBLIC_KEY 

# 2. Lock them into the container's memory
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY

RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml* ./
# Mount the pnpm store cache
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
# 3. Vite will now see them in the system memory (no .env file needed!)
RUN pnpm build 

# ==========================================
# Stage 2: Serve with Nginx
# ==========================================
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the compiled React app from the builder stage
# NOTE: Make sure your Vite build output folder is actually "dist". 
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]