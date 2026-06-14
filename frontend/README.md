# Gestion Charité

A full-stack SaaS platform designed to seamlessly connect donors with verified charitable organizations. Built with a focus on secure transactions, scalable architecture, and a modern user experience.

## 🚀 Tech Stack

### Frontend
* **Framework:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Package Manager:** pnpm

### Backend
* **Framework:** Spring Boot (Java)
* **Authentication:** JWT (JSON Web Tokens)
* **Payments:** Stripe API (Checkout & Secure Webhooks)
* **Database:** PostgreSQL (Hosted via Supabase) / H2 (Local Development)

### DevOps & Infrastructure
* **Containerization:** Docker & Docker Compose
* **CI/CD:** Jenkins (Automated pipeline via GitHub Webhooks)
* **Reverse Proxy:** Nginx
* **Security:** Let's Encrypt (SSL) & Cloudflare
* **Hosting:** Linux VPS (Ubuntu)

---

## 🏗️ Architecture Overview

The application is split into two primary micro-services, deployed independently but orchestrated together via Docker Compose in the production environment:

1. **Client UI (`/frontend`):** A React SPA communicating with the backend via REST.
2. **REST API (`/backend`):** A Spring Boot application managing business logic, Stripe webhooks, and Supabase database transactions.

---

## 💻 Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org/) (v20+) & [pnpm](https://pnpm.io/)
* [Java](https://www.oracle.com/java/) (v17+)
* [Docker](https://www.docker.com/) & Docker Compose
* Stripe Developer Account
* Supabase Account

### 1. Clone the Repository
```bash
git clone [https://github.com/Nyckboy/GestionCharite.git](https://github.com/Nyckboy/GestionCharite.git)
cd GestionCharite
```

### 2. Frontend Setup

Navigate to the frontend directory, install dependencies, and set up your local environment variables.

```bash
cd frontend
pnpm install
```
Create a *.env* file in the */frontend* directory:

```env 
VITE_API_URL=http://localhost:8081
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_test_public_key
```

Start the development server:

```bash
pnpm dev
```

### 3. Backend Setup
The backend utilizes Spring Profiles to seamlessly switch between local and production environments. By default, running locally uses the `dev` profile with an in-memory H2 database.

Create a `.env` file (or set your system environment variables) in the `/backend` directory:
```env
STRIPE_API_KEY=your_stripe_test_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_test_webhook_secret
```

Run the Spring Boot application using your IDE or via Maven/Gradle wrapper. The local API will be exposed on http://localhost:8081.

---

## 🚢 CI/CD & Deployment

This project uses a fully automated Continuous Deployment pipeline powered by **Jenkins**.

1. Code pushed to the `main` branch triggers a GitHub Webhook.
2. Jenkins pulls the latest code and securely injects production secrets (Stripe, Supabase, JWT) from its credential vault.
3. The pipeline builds fresh Docker images for both the frontend and backend without caching.
4. `docker-compose up -d` orchestrates the new containers with zero downtime.
5. Nginx proxies incoming traffic from `gestioncharite.mouadabbassid.com` and `api-charite.mouadabbassid.com` to the respective internal Docker ports.

---

## 🔒 Security Notes

* All sensitive credentials (API keys, database passwords, JWT secrets) are excluded from version control and injected exclusively at runtime via the Jenkins pipeline.
* Webhook payloads are cryptographically verified using Stripe's signature headers to prevent malicious requests.