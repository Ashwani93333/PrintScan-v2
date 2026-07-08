# 🖨️ PrintEase Cloud - Frontend

Welcome to the **PrintEase** frontend repository! This is a modern, responsive, and highly animated React application built with Vite and Tailwind CSS. It serves as the comprehensive user interface for the PrintEase Cloud network, a next-generation document printing and routing platform.

## 🚀 Key Features by Role

The application is securely partitioned into three distinct user roles, each with specialized interfaces and capabilities.

### 🌐 Public Features (No Account Required)
*   **Modern Landing Page:** Featuring glass-morphism UI, a 3D Tilt-Card interactive live demo, and a fully responsive pricing section.
*   **Direct Shop Access:** Users can enter a shop's unique slug (e.g., `campus-quick-print`) to instantly access that shop's direct upload portal.
*   **Guest File Uploads:** Drop PDFs, JPGs, PNGs, or DOCX files directly. Real-time cost estimation calculates price based on shop-specific Color/B&W rates and page counts.
*   **Live Job Tracking:** Receive a custom 6-character token to track print status in real-time without ever creating a user account.
*   **Shop Registration:** A seamless, multi-step onboarding flow for new shop owners to register their business, set up admin credentials, and apply for network approval.

### 🏪 Admin Features (Shop Owners)
*   **Live Dashboard:** Real-time job queue monitoring to track incoming, pending, and completed print requests.
*   **Print Configuration & Execution:** View uploaded customer files, configure settings, and process prints.
*   **Pricing Controls:** Full autonomy to adjust per-page printing costs for both Color and Black & White prints.
*   **Analytics & Earnings:** Track daily, weekly, and monthly revenue and total pages printed.

### 🛡️ Super Admin Features (Platform Managers)
*   **Centralized Shop Management:** An approval-based workflow for new shop registrations. Shops are inactive by default until approved by a Super Admin.
*   **Platform Analytics:** View granular analytics for any specific shop, including total jobs, revenue, completed jobs, and total page counts.
*   **Access Revocation & Auditing:** Reject or delete shops, automatically triggering cascaded removal of corresponding admin user accounts. 
*   **Streamlined UI:** Optimized data tables and unified error handling mapped directly to backend DTO specifications.

---

## 🔒 Security & Authentication Architecture

PrintEase prioritizes enterprise-grade security for all user sessions and API communications.

### HttpOnly Cookies & JWT
We have completely migrated away from vulnerable `localStorage` token storage. Authentication is securely managed via **HttpOnly, Secure, SameSite cookies**. 
*   When a user logs in, the backend issues a JWT directly to the browser's cookie storage, rendering it inaccessible to malicious client-side JavaScript (XSS protection).
*   The `AuthContext` hydrates the user session dynamically by querying the secure `/api/auth/me` endpoint.

### CSRF Protection
To prevent Cross-Site Request Forgery, the application integrates tightly with Spring Boot's `CookieCsrfTokenRepository`.
*   A dedicated `/api/auth/csrf` endpoint is queried during initialization to retrieve the `XSRF-TOKEN`.
*   All subsequent mutating API requests (`POST`, `PUT`, `DELETE`) automatically attach the CSRF token in the headers via our configured Axios client interceptors.

### Route Protection & Redirection
React Router is heavily utilized alongside `AuthContext` to guard sensitive routes. Users attempting to access `/admin/*` or `/superadmin/*` without the correct JWT role claims are instantly redirected, and session expiration automatically triggers a secure logout and redirect to the login panel.

---

## ⚡ State Management & Caching

*   **AuthContext Caching:** The global user state is aggressively cached in memory by the `AuthContext` to prevent redundant `/api/auth/me` network requests on every route change. This eliminates "UI flickering" and provides a buttery-smooth navigation experience.
*   **Optimized React Rendering:** Standardized form validation and centralized error handling (via user-facing toast notifications) reduce unnecessary re-renders. 
*   **API Interceptors:** Centralized API services handle all network communication, utilizing standardized request/response caching configurations and automatically pruning deprecated request payloads to ensure absolute compliance with backend DTOs.

---

## 🛠️ Tech Stack

*   **Framework:** React 19 + Vite
*   **Routing:** React Router v7
*   **Styling:** Tailwind CSS v4 + PostCSS
*   **Icons:** Lucide React
*   **Charts/Analytics:** Recharts
*   **Linting:** ESLint

---

## 📦 Usage & Installation

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Setup Steps
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd printScan-v2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

4. **Build for Production:**
   ```bash
   npm run build
   ```
   This will generate a highly optimized, minified bundle in the `dist` folder.

---

## 🌍 Environment Variables

Create a `.env` file in the root of your project to manage your configuration. **Never commit this file to version control.**

```env
# Example .env configuration
VITE_API_BASE_URL=https://api.printease.com  # The base URL for your Spring Boot backend API
VITE_APP_ENV=production                      # Your current environment (development, staging, production)
```
*Note: In Vite, only variables explicitly prefixed with `VITE_` are exposed to your React client code.*

---

## 🔒 Security & Git Configuration

To protect sensitive keys, API routes, and keep your repository clean, you must ensure your `.gitignore` file includes the following essential entries. **Critically, never push your `.env` files.**

```gitignore
# Logs
logs
*.log
npm-debug.log*

# Dependency directories
node_modules/

# Production build output
dist/
dist-ssr/

# Environment Variables (CRITICAL)
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE and Editor files
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

---

## 🚀 Best Deployment Options

Because this is a Vite-based React Single Page Application (SPA), running `npm run build` outputs pure static files (HTML, CSS, JS) into the `dist` folder. This makes it extremely cheap and fast to host. Here are the best deployment options:

### 1. Vercel (Highly Recommended)
Vercel offers zero-config deployments for Vite apps and boasts incredibly fast global edge networks.
*   **Setup:** Connect your GitHub repo to Vercel. It automatically detects the Vite framework.
*   **Settings:** 
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
*   **Environment Variables:** Add your `VITE_API_BASE_URL` securely in the Vercel dashboard under *Settings > Environment Variables*.

### 2. Netlify
An excellent alternative to Vercel, providing robust CI/CD, branch previews, and easy configuration.
*   **Setup:** Connect your GitHub repo to Netlify.
*   **Settings:**
    *   Build Command: `npm run build`
    *   Publish Directory: `dist`
*   **Routing Fix Note:** For React Router to work correctly on Netlify, you must create a file named `_redirects` inside your `public/` directory with this exact content: `/* /index.html 200`. This tells Netlify to let React Router handle the routing.

### 3. AWS S3 + CloudFront (Enterprise Scale)
For maximum scalability, lowest raw cost, and deep ecosystem integration (especially if your Spring Boot backend is on AWS EC2/ECS).
*   **Setup:** Run `npm run build` via a CI/CD pipeline like GitHub Actions.
*   **Deployment:** Sync the contents of the `dist` folder to an Amazon S3 bucket configured for static website hosting.
*   **CDN:** Place an AWS CloudFront distribution in front of the S3 bucket to serve the files globally via HTTPS, cache assets at the edge, and handle routing fallbacks to `index.html`.
