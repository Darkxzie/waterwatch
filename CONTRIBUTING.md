# Contributing to WaterWatch

This document explains how Group KMS should contribute to WaterWatch as a coordinated engineering team. It is written specifically for the current KMS team profile and assigns responsibilities according to each member's published strengths and learning goals.

Reference team profile:

- KMS Team Portfolio: <https://darkxzie.github.io/kms-team-portfolio/>

## Team-Based Contribution Model

Group KMS is composed of three complementary contributors:

- Kamal Manchenella: AI research, machine learning, deep learning, technical writing
- Madhura Bhattu: embedded systems, AI/ML, design-oriented thinking
- Siddharth Chukka: full-stack development, databases, systems

WaterWatch fits the team well because it requires:

- an AI-assisted classification pipeline
- a production-style full-stack web app
- thoughtful UX for both citizens and authorities
- clean documentation and maintainable collaboration

## Ownership Split

### Kamal Manchenella

Primary ownership:

- AI complaint analysis service
- prompt design and response validation
- AI fallback behavior and analysis retry strategy
- analytics definitions and severity/priority logic
- technical documentation and architecture notes

Suggested WaterWatch scope:

- [server/services/aiAnalysis.js](C:\Users\gask4\waterwatch\server\services\aiAnalysis.js)
- AI response schema validation and parsing hardening
- confidence scoring policy
- analytics interpretation and reporting logic
- README and product documentation maintenance

Secondary support:

- backend API design review
- testing around AI failure modes
- issue triage policy definition

### Madhura Bhattu

Primary ownership:

- citizen-facing UX quality
- complaint form experience and accessibility
- visual design polish
- location confirmation flow
- future civic hardware or sensor integration concepts

Suggested WaterWatch scope:

- [client/src/pages/Report.jsx](C:\Users\gask4\waterwatch\client\src\pages\Report.jsx)
- [client/src/components](C:\Users\gask4\waterwatch\client\src\components)
- input states, error states, and mobile responsiveness
- map interaction ergonomics
- design consistency across citizen and authority surfaces

Secondary support:

- AI-assisted UX decisions for report quality
- manual test cases for real-world issue reporting
- future IoT or embedded extension ideas for water monitoring

### Siddharth Chukka

Primary ownership:

- full-stack feature wiring
- database-backed complaint flows
- auth flows and protected routes
- admin dashboard behavior
- API integration between frontend and backend

Suggested WaterWatch scope:

- [server/routes](C:\Users\gask4\waterwatch\server\routes)
- [server/controllers](C:\Users\gask4\waterwatch\server\controllers)
- [server/prisma/schema.prisma](C:\Users\gask4\waterwatch\server\prisma\schema.prisma)
- [client/src/lib/api.js](C:\Users\gask4\waterwatch\client\src\lib\api.js)
- [client/src/hooks](C:\Users\gask4\waterwatch\client\src\hooks)
- [client/src/pages/Dashboard.jsx](C:\Users\gask4\waterwatch\client\src\pages\Dashboard.jsx)
- [client/src/pages/Analytics.jsx](C:\Users\gask4\waterwatch\client\src\pages\Analytics.jsx)

Secondary support:

- query performance and pagination
- integration testing
- deployment readiness

## Work Breakdown For WaterWatch

To avoid overlap and unclear ownership, use the following split.

### Track 1: AI Triage and Complaint Intelligence

Owner: Kamal

Deliverables:

- production-ready Claude analysis pipeline
- structured JSON parsing and retry behavior
- AI quality checks for category, severity, and priority
- analytics definitions that align with civic operations

Dependencies:

- complaint submission data from Siddharth
- UI presentation of AI results from Madhura

### Track 2: Citizen Experience

Owner: Madhura

Deliverables:

- polished report form
- mobile-friendly upload and location flow
- complaint success state
- public map filters and interaction design
- accessibility improvements

Dependencies:

- live API and auth flow from Siddharth
- AI result fields from Kamal

### Track 3: Platform Backbone

Owner: Siddharth

Deliverables:

- auth and complaint APIs
- Prisma migrations and data model stability
- frontend-backend integration
- admin dashboard and analytics wiring
- pagination, filtering, and protected routes

Dependencies:

- triage output contract from Kamal
- UI states and component expectations from Madhura

## Collaboration Rules

### Branching

Each member should work on focused branches:

- `feat/ai-triage-*`
- `feat/citizen-ui-*`
- `feat/platform-*`
- `fix/*`
- `docs/*`

Avoid large mixed-purpose branches.

### Pull Requests

Every PR should:

- solve one focused problem
- include a short summary of user impact
- mention affected routes, pages, or schema changes
- include test or verification notes
- request review from the most relevant teammate

Suggested review routing:

- AI logic PRs: Kamal reviews first
- UI and UX PRs: Madhura reviews first
- schema/API/integration PRs: Siddharth reviews first

### Commit Style

Use clear conventional-style commits:

- `feat: add complaint submission mutation`
- `fix: prevent invalid image mime upload`
- `docs: add authority workflow manual`
- `refactor: split admin analytics service`

### Review Standard

Review for:

- correctness
- maintainability
- user impact
- security implications
- mobile behavior
- API contract consistency

Do not approve code just because it works locally.

## Shared Engineering Workflow

The KMS portfolio emphasizes:

- daily check-ins
- weekly demos
- pair programming
- collaborative debugging

Apply that directly here.

### Daily Check-In

Each member should post:

- what is in progress
- what changed yesterday
- blockers
- whether a review is needed

### Weekly Demo

At least once per week, demo:

- one citizen-facing improvement
- one authority-facing improvement
- one backend or AI improvement

### Pairing Recommendations

Recommended pairs:

- Kamal + Siddharth for AI-service and API contract work
- Madhura + Siddharth for form, map, and dashboard integration
- Kamal + Madhura for AI explanation UX and result presentation

## Definition of Done

A task is not done until:

- code is committed on a focused branch
- relevant tests pass
- manual verification is documented
- documentation is updated if behavior changed
- another teammate has reviewed it when the change is non-trivial

## Testing Expectations

### Kamal

Should verify:

- malformed AI output handling
- no-markdown JSON parsing behavior
- fallback analysis path
- severity and priority edge cases

### Madhura

Should verify:

- mobile layout
- keyboard navigation
- upload and validation behavior
- empty/error/success states

### Siddharth

Should verify:

- auth middleware behavior
- complaint CRUD flows
- pagination and filters
- Prisma queries and route protections

## Documentation Responsibilities

Documentation ownership should also be distributed.

- Kamal: architecture, AI behavior, system notes
- Madhura: user experience notes, screenshots, usability flows
- Siddharth: setup, API behavior, data flow, deployment notes

## Priority Order For Group KMS

Build WaterWatch in this order:

1. Siddharth completes database-backed auth and complaint submission flow.
2. Kamal hardens AI triage and complaint analysis output handling.
3. Madhura refines the citizen reporting experience and post-submit clarity.
4. Siddharth wires dashboard, complaint tracking, and analytics data plumbing.
5. Kamal and Madhura together improve how AI insights are presented to users and authorities.

## Current Recommended Task Allocation

Immediate next assignments:

- Kamal
  - finalize `aiAnalysis.js`
  - define AI output validation contract
  - document severity and priority policy

- Madhura
  - redesign `Report.jsx` into a production-ready citizen flow
  - add upload preview, inline validation, and strong mobile behavior
  - improve public map interaction design

- Siddharth
  - connect frontend report form to backend complaint submission
  - implement login/register UI flow against live API
  - wire dashboard and my-complaints pages to real backend data

## Conduct

Contribute with:

- clear ownership
- direct communication
- honest review
- working software over vague planning
- documentation that stays current with code

WaterWatch should be treated as a real product, not just a demo. That means quality, accountability, and visible iteration matter.
