# WaterWatch Test Suite Design

## Goal

Add a meaningful automated test suite across both the client and server that covers real user-visible and API-visible behavior, skips redundant and tiny helper tests, and supports an iterative fix-and-rerun workflow until the suite passes cleanly.

## Scope

This work covers:

- client route-level pages and meaningful shared components
- server HTTP routes and important controller-backed flows
- key error and branching states that affect working UI or API behavior
- coverage-oriented verification runs across both workspaces

This work does not aim to:

- chase artificial 100% coverage on tiny pure helpers, constants, or decorative wrappers
- add snapshot-heavy tests with low behavioral signal
- add end-to-end browser automation unless unit/integration coverage proves insufficient

## Testing Strategy

### Client

Client tests should focus on rendered behavior rather than implementation details.

Primary targets:

- route-level pages such as `Home`, `Report`, `Map`, `MyComplaints`, `Dashboard`, `Analytics`, and `Login`
- shared components whose branching or state materially affects the UI, such as `Navbar`, `OfflineBanner`, complaint cards, status timelines, and map fallbacks
- app routing behavior in both development-style and static-hosting-safe production mode where applicable

Approach:

- use React Testing Library and Vitest
- mock network calls, geolocation, and browser APIs only where unavoidable
- prefer integration-style tests that exercise a page with its immediate child components
- skip tests for tiny formatting utilities or presentational wrappers unless they gate visible behavior

### Server

Server tests should validate the public Express behavior through HTTP requests rather than isolated low-value unit tests.

Primary targets:

- auth flows
- complaint creation and complaint retrieval flows
- public map endpoints
- admin complaint and analytics endpoints
- middleware-sensitive failure cases such as unauthenticated access, invalid payloads, and handled internal errors

Approach:

- use request-level integration tests around the Express app
- mock Prisma, storage, token helpers, and AI analysis boundaries where needed
- keep tests deterministic and independent of external services or a real database
- add narrower unit tests only where route-level testing would be excessively indirect for meaningful branching

## Code Change Policy

Production code changes are allowed only when tests expose a real gap that blocks a working UI or API flow, or when code must be made testable without changing intended behavior.

Allowed examples:

- dependency injection or seam creation for external services
- correcting stale expectations or broken route assumptions
- small behavior fixes where a user-visible or API-visible flow is currently broken

Disallowed examples:

- broad refactors unrelated to testability or correctness
- writing tests for tiny helpers purely to inflate coverage numbers

## Verification

Implementation is only complete when all of the following are true:

- client tests pass
- server tests pass
- coverage run completes across both workspaces
- any failing tests discovered during implementation have been resolved through targeted fixes and reruns
- changes are pushed to `main` on `code.swecha.org`

## Risks And Constraints

- some current modules may be scaffold-like or placeholder-heavy, so tests must distinguish between intended current behavior and non-functional aspirational behavior
- route-level client tests may require controlled mocks for auth state, query state, network calls, and browser APIs
- server routes may currently couple tightly to infrastructure helpers, requiring small testability seams before meaningful integration tests can be added

## Execution Outline

1. inventory the highest-value client and server behaviors
2. add failing tests first for those behaviors
3. fix only the real blockers exposed by tests
4. rerun tests repeatedly until green
5. run full verification and coverage commands
6. push successful changes to `main` on `code.swecha.org`
