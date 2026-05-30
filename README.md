# WaterWatch

WaterWatch is an AI-assisted civic reporting platform for water-related urban issues such as pipe leaks, no water supply, dirty water, and water wastage. Citizens can submit complaints with photos and GPS location, while municipal authorities can review, prioritize, assign, and resolve issues through an operations dashboard.

This repository currently contains the initial full-stack scaffold for the platform, including a React frontend, Express API, Prisma schema, shared Zod validation, and baseline tests.

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
- `npm run test`
- `npm run prisma:generate`
- `npm run prisma:migrate`

## Testing And Verification

Verified during scaffold setup:

- `npm install`
- `npm run prisma:generate --workspace server`
- `npm run test --workspace server`
- `npm run test --workspace client`
- `npm run build --workspace client`

Current test coverage is minimal and focused on bootstrap health:

- backend health endpoint smoke test
- frontend app-shell render smoke test

## Security Notes

The scaffold includes initial support for:

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
- React route shell and design system foundation
- Express route/controller structure
- Prisma schema and client generation
- shared Zod schemas
- baseline tests

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
