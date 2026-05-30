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
  client/              React frontend
  server/              Express backend
  shared/              Shared schemas/constants
  .env.example         Required environment variables
  package.json         npm workspace root
  README.md            Project overview and developer setup
  USER_MANUAL.md       End-user guide for citizens and authorities
```

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
