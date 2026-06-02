# WaterWatch

WaterWatch is an AI-assisted civic reporting platform for water-related urban issues such as pipe leaks, no water supply, dirty water, and water wastage. Citizens can submit complaints with photos and GPS location, while municipal authorities can review, prioritize, assign, and resolve issues through an operations dashboard.

This repository currently contains the initial full-stack scaffold for the platform, including a React frontend, Express API, Prisma schema, shared Zod validation, and baseline tests.

## Live Demo

- Verified public live URL: `https://darkxzie.github.io/waterwatch/`
- GitLab Pages job publishes the static frontend from `client/dist` via `.gitlab-ci.yml`
- GitHub Pages workflow publishes the same frontend from this repository via `.github/workflows/deploy-github-pages.yml`
- GitLab artifact browser URL: `https://code.swecha.org/Kamel/waterwatch/-/jobs/artifacts/main/file/public/index.html?job=pages`
- Raw artifact URL: `https://code.swecha.org/Kamel/waterwatch/-/jobs/artifacts/main/raw/public/index.html?job=pages`
- Pages hostname exposed by the GitLab instance: `http://kamel.pages.swecha.net/-/waterwatch/-/jobs/<job-id>/artifacts/public/index.html`

Note:

- the GitHub Pages URL above was verified to return HTTP 200 and serve the built `WaterWatch` app shell
- production builds use `HashRouter` so static hosting works on GitHub Pages and other no-rewrite hosts
- the artifact browser URL opens the GitLab job artifacts UI, not the app itself
- the raw artifact URL serves the built `index.html` payload, but many browsers download it because GitLab returns it as `application/octet-stream`
- the `kamel.pages.swecha.net` hostname was observed failing DNS resolution, so the Pages URL is not currently usable
- GitHub Pages is the current browser-openable public demo while Swecha Pages remains unavailable
- interactive API features still require a reachable backend API unless a hosted backend is added later
- fixing public access requires Swecha/GitLab admin-side Pages DNS or host configuration changes rather than frontend code changes in this repository

## Deployment Decision

The repository should keep **GitHub Pages** as the default public frontend deployment for now.

Vercel is **not** the better default fit for the current architecture because:

- the frontend is already a static Vite build that works cleanly on Pages with `HashRouter`
- the backend is a stateful Express + Prisma + PostgreSQL service, not a serverless-first Vercel API layout
- moving only the frontend to Vercel would not solve the main production need, which is reliable backend hosting

Recommended production topology:

- frontend demo or docs UI: GitHub Pages
- backend API: Docker on Render, Railway, Fly.io, or a VM/container platform
- database: managed PostgreSQL

The included `Dockerfile` is intended for backend-oriented container deployment.

## Features

- Citizen complaint reporting flow with issue type, description, photo, and location
- AI analysis service for category, severity, priority, summary, and department suggestion
- Public map API surface for non-PII complaint display
- Citizen complaint tracking page
- Authority complaint management endpoints
- Analytics endpoint scaffold for summaries, trends, and resolution time
- JWT-based auth with refresh-token cookie support
- Shared validation schemas between frontend and backend

## Tech Stack

- Frontend: React 18, Vite, Tailwind CSS v3, React Router v6
- Client state: Zustand, React Query
- Backend: Node.js, Express
- Database: PostgreSQL with Prisma ORM
- Validation: Zod
- AI: Anthropic Claude vision API with local heuristic fallback
- Maps: Leaflet integration surface
- Auth: JWT access token + refresh token
- Logging: Winston

## Repository Structure

```text
waterwatch/
  client/                  React frontend
    src/
      components/          Reusable UI, layout, complaint, map, dashboard pieces
      constants/           App constants such as issue types and status flow
      hooks/               React Query, auth, geolocation, and UI hooks
      lib/                 API client and shared frontend integrations
      pages/               Route-level pages
      store/               Zustand stores
      utils/               Formatting and display helpers
      App.jsx              Route shell
      main.jsx             React entry point
      index.css            Tailwind entry and theme styles
    index.html             Vite HTML shell
    package.json           Frontend dependencies and scripts
    tailwind.config.js     Tailwind theme configuration
    vite.config.js         Vite configuration
  server/                  Express backend
    controllers/           Route handlers for auth, complaints, and admin features
    middleware/            Auth, upload, rate limit, and error middleware
    prisma/
      schema.prisma        Database schema
    routes/                Express route modules
    services/              AI analysis and storage services
    tests/                 Backend smoke tests
    utils/                 Logger, Prisma client, response helpers, token helpers
    app.js                 Express app factory
    index.js               Server entry point
    package.json           Backend dependencies and scripts
  shared/                  Shared package used by client and server
    schemas/               Shared Zod validation schemas and constants
    package.json           Shared package manifest
  .env.example             Required environment variables
  CONTRIBUTING.md          Team workflow and contribution guidelines
  README.md                Project overview and developer setup
  USER_MANUAL.md           End-user guide for citizens and authorities
  package.json             npm workspace root
  package-lock.json        Workspace lockfile
```

## Project Structure Details

### `client/`

The frontend contains the citizen and authority user interfaces. It is organized so route pages stay thin and reusable logic is pushed into components, hooks, stores, and utilities.

- `src/components/`
  - `ui/` contains reusable building blocks such as buttons, badges, and banners
  - `layout/` contains shared layout wrappers and navigation
  - `complaints/` contains complaint-specific cards and status UI
  - `map/` contains map-related components
  - `dashboard/` contains authority dashboard presentation components
- `src/pages/` contains route-level screens like `Home`, `Report`, `Map`, and `Dashboard`
- `src/hooks/` contains data access and browser-behavior hooks
- `src/store/` contains Zustand state slices
- `src/lib/` contains the Axios API client
- `src/utils/` contains small pure helpers

### `server/`

The backend is structured around Express route groups and supporting services.

- `routes/` defines the public API surface
- `controllers/` holds the request handlers used by those routes
- `middleware/` contains cross-cutting concerns like auth and upload validation
- `services/` contains integrations such as Claude-based AI analysis and storage handling
- `utils/` contains shared backend infrastructure helpers
- `prisma/schema.prisma` defines the database models and enums
- `tests/` contains backend verification

### `shared/`

The shared workspace package keeps validation and cross-layer contracts in one place so the client and server use the same schemas.

- `schemas/index.js` contains shared Zod schemas, enums, and query validation helpers

## Application Architecture

### Frontend

The frontend is a Vite-based React application with route-level pages for:

- `Home`
- `Report`
- `Map`
- `MyComplaints`
- `Dashboard`
- `Analytics`
- `Login`

State is split between:

- React Query for server state
- Zustand for auth, UI, and filters

### Backend

The backend is an Express app with route groups for:

- `/api/auth`
- `/api/complaints`
- `/api/map`
- `/api/admin`

Core backend responsibilities:

- validate payloads using shared Zod schemas
- enforce role-based access
- accept multipart image uploads
- run AI analysis on complaint submission
- store complaint lifecycle data in PostgreSQL

### Database

Prisma models currently include:

- `User`
- `Complaint`

Enums include:

- `Role`
- `IssueType`
- `Severity`
- `Priority`
- `Status`

See [server/prisma/schema.prisma](C:\Users\gask4\waterwatch\server\prisma\schema.prisma) for the current schema.

## API Overview

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Citizen Complaints

- `POST /api/complaints`
- `GET /api/complaints/mine`
- `GET /api/complaints/:id`
- `POST /api/complaints/:id/upvote`

### Public Map

- `GET /api/map/complaints`
- `GET /api/map/heatmap`

### Authority / Admin

- `GET /api/admin/complaints`
- `PATCH /api/admin/complaints/:id/status`
- `PATCH /api/admin/complaints/:id/assign`
- `GET /api/admin/analytics/summary`
- `GET /api/admin/analytics/trends`
- `GET /api/admin/analytics/resolution-time`

## Environment Variables

Copy `.env.example` to `.env` and provide real values.

Required keys:

```env
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
ANTHROPIC_API_KEY=
CLOUDINARY_URL=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET=
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Generate Prisma client

```bash
npm run prisma:generate
```

### 4. Create the PostgreSQL database and run migrations

```bash
npm run prisma:migrate
```

### 5. Start the app

```bash
npm run dev
```

Default URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000/api`

## Available Scripts

At repository root:

- `npm run dev`
- `npm run dev:client`
- `npm run dev:server`
- `npm run build`
- `npm run format`
- `npm run format:check`
- `npm run lint`
- `npm run type-check`
- `npm run test`
- `npm run test:coverage`
- `npm run audit`
- `npm run changelog`
- `npm run prisma:generate`
- `npm run prisma:migrate`

## Testing And Verification

Repository quality gates:

- ESLint for client and server JavaScript
- Prettier formatting checks
- TypeScript-based structural checking for the JavaScript workspace
- server coverage enforcement with `c8`
- client coverage enforcement with Vitest coverage thresholds
- npm audit in CI
- gitleaks secret scanning in CI
- Husky + lint-staged pre-commit enforcement

Current enforced coverage thresholds:

- server: at least 80% statements and lines
- client: at least 80% statements and lines

## Security Notes

The repository now includes:

- `SECURITY.md` with disclosure and response expectations
- gitleaks configuration for secret scanning
- dependency audit workflow for npm workspaces
- hardened CI checks that fail on audit findings
- existing application protections such as auth, rate limiting, and upload restrictions

The application scaffold also includes:

- JWT auth middleware
- role-based authorization
- upload MIME-type restrictions
- rate limiting for complaint submission
- Helmet security headers
- CORS restriction to configured client origin

Before production use, you should still add:

- refresh token rotation and revocation
- real object storage instead of base64 data URI persistence
- audit logging for admin actions
- stronger validation and sanitation coverage
- secrets management and deployment hardening

## Current Implementation Status

Implemented now:

- monorepo workspace setup
- open-source health files and governance docs
- Docker packaging and container healthcheck
- ESLint, Prettier, Husky, lint-staged, changelog automation, and GitLab/GitHub CI quality gates
- React route shell and design system foundation
- Express route/controller structure
- Prisma schema and client generation
- shared Zod schemas
- expanded route, hook, utility, and page tests

Partially implemented or placeholder-only:

- real complaint submission wiring from UI to API
- object storage integration with S3 or Cloudinary
- reverse geocoding
- live Leaflet map and clustering
- analytics charts with real backend data
- authority bulk actions and richer dashboard workflows
- production-ready refresh-token handling

## Roadmap

Recommended next steps:

1. Wire the `Report` form to the backend complaint submission endpoint.
2. Replace the temporary storage service with S3 or Cloudinary.
3. Connect map pages to live complaint and heatmap data.
4. Implement protected citizen and authority route guards.
5. Build dashboard filters, sorting, and inline status updates.
6. Bind analytics charts to `/api/admin/analytics/*` responses.
7. Add integration and end-to-end tests.

## User Documentation

For operational usage instructions, see [USER_MANUAL.md](C:\Users\gask4\waterwatch\USER_MANUAL.md).
