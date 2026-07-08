# PrintEase Frontend Deployment Guide (Vercel)

This guide provides step-by-step instructions for deploying the PrintEase React (Vite) frontend to Vercel, managing environments, and ensuring a seamless transition from development to production.

## 1. Preparing for GitHub

Before deploying, you must push your code to GitHub. You should **only** push source code, configuration files, and public assets. 

### Files that MUST be pushed:
- `src/` (All React components, styles, hooks, context)
- `public/` (Images, SVGs, favicon, `printease-logo.jpeg`)
- `package.json` & `package-lock.json` (Lock files are critical for consistent Vercel builds)
- `vite.config.js`
- `index.html`
- `tailwind.config.js` & `postcss.config.js`
- `eslint.config.js`
- `.gitignore`
- `vercel.json` (We will create this below for routing)

### Files that MUST NOT be pushed:
- `node_modules/` (Dependencies are installed natively by Vercel)
- `dist/` (Build output is generated on the server)
- `.env`, `.env.local`, `.env.production` (Keep your API secrets and local configs out of source control!)

**Ensure your `.gitignore` file contains these exact lines:**
```text
node_modules
dist
dist-ssr
*.local
.env
.env.*
.DS_Store
```

## 2. Managing Environment Variables

Vite uses `.env` files to manage environment variables. To be exposed to your React code, variables MUST be prefixed with `VITE_`.

### Development Mode (Local)
Create a `.env.development` file in your root folder. This file is specifically for local coding and can be safely ignored by Git.
```env
VITE_API_BASE_URL=http://localhost:8080/api
```
When you run `npm run dev`, Vite automatically detects and uses this file.

### Production Mode (Vercel)
You **do not** commit a production `.env` file to GitHub. Instead, you will input your production variables directly into Vercel's dashboard.

Your production variable should point to your live, hosted Spring Boot backend:
```env
VITE_API_BASE_URL=https://your-springboot-backend.com/api
```

## 3. Deploying to Vercel

Vercel is the optimal hosting provider for Vite/React frontends due to its global Edge network and instant GitHub CI/CD integration.

**Step-by-step Deployment:**
1. Go to [Vercel.com](https://vercel.com/) and sign in with your GitHub account.
2. Click **Add New** > **Project**.
3. Import your PrintEase GitHub repository.
4. **Configure Project:**
   - **Framework Preset**: Vercel should auto-detect **Vite**.
   - **Root Directory**: `./` (Leave as default).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables:**
   - Expand the "Environment Variables" section.
   - Add Name: `VITE_API_BASE_URL`
   - Add Value: `https://your-springboot-backend.com/api` (Replace with your actual backend URL).
6. Click **Deploy**. Vercel will build your app and provide you with a live, SSL-secured URL (e.g., `https://printease.vercel.app`).

## 4. Production Best Practices & Gotchas

### A. Fixing Client-Side Routing (404 on Refresh)
Because React is a Single Page Application (SPA), if a user manually refreshes a nested route like `/admin/dashboard`, Vercel's server will look for a physical file named `dashboard.html` and return a 404 error.

To fix this, create a `vercel.json` file in your root directory and **push this to GitHub**:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
This tells Vercel to route all traffic through your React router.

### B. Handling CORS & HttpOnly Cookies
Since your frontend (Vercel) and backend (Spring Boot) will reside on completely different domains in production, you must update your Spring Boot backend's CORS configuration to explicitly allow your new Vercel domain.

In your Spring Boot `WebConfig.java` or `SecurityConfig.java`:
```java
configuration.setAllowedOrigins(Arrays.asList("https://printease.vercel.app")); // Your generated Vercel URL
configuration.setAllowCredentials(true); // Crucial for passing HttpOnly cookies
```

**Important Cookie Configuration:** Because Vercel and your API are on different domains (Cross-Origin), your backend MUST configure its HttpOnly cookies with `Secure=true` (requires HTTPS) and `SameSite=None`. If these are not set, modern browsers like Chrome will block the authentication cookies and your login will fail in production.

## 5. Continuing Development Workflow

Once deployed, your workflow becomes highly automated and separated from production:

1. **Local Work**: You continue coding locally using `npm run dev`. Because of your `.env.development` file, your local app will seamlessly talk to your local backend (`localhost:8080`).
2. **Pushing Updates**: When you finish a feature, run:
   ```bash
   git add .
   git commit -m "Your descriptive message"
   git push
   ```
3. **Automated Deployments**: Vercel continuously listens to your GitHub repository. The moment you push to your `main` branch, Vercel will automatically trigger a new production build. It will compile your code and deploy your changes globally with **zero downtime**.
