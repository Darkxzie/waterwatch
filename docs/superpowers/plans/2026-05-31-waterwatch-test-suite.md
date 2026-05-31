# WaterWatch Test Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-value client and server test suite for WaterWatch, fix test-exposed behavior gaps that affect working UI or API flows, and push the resulting green suite to `main` on `code.swecha.org`.

**Architecture:** Use integration-first testing. On the client, exercise route-level pages and branching shared components with React Testing Library and targeted mocks for browser/network boundaries. On the server, exercise the Express app through HTTP requests with deterministic module seams around Prisma, auth tokens, storage, and AI analysis.

**Tech Stack:** React, Vitest, React Testing Library, Node test runner, Supertest, Express, Prisma module mocks

---

## File Structure

### Client files to create or modify

- Modify: `client/package.json`
- Modify: `client/src/App.test.jsx`
- Create: `client/src/test/renderApp.jsx`
- Create: `client/src/test/setup.js`
- Create: `client/src/pages/Home.test.jsx`
- Create: `client/src/pages/Report.test.jsx`
- Create: `client/src/pages/Login.test.jsx`
- Create: `client/src/pages/MyComplaints.test.jsx`
- Create: `client/src/pages/Dashboard.test.jsx`
- Create: `client/src/pages/Analytics.test.jsx`
- Create: `client/src/pages/Map.test.jsx`
- Create: `client/src/components/layout/Navbar.test.jsx`
- Create: `client/src/components/complaints/ComplaintCard.test.jsx`
- Create: `client/src/components/complaints/StatusTimeline.test.jsx`
- Create: `client/src/components/ui/OfflineBanner.test.jsx`
- Modify only if tests expose real blockers: `client/src/hooks/useAuth.js`, `client/src/hooks/useComplaints.js`, `client/src/hooks/useGeolocation.js`, `client/src/lib/api.js`, route pages/components under `client/src`

### Server files to create or modify

- Modify: `server/tests/app.test.js`
- Create: `server/tests/helpers/mockModules.js`
- Create: `server/tests/auth.routes.test.js`
- Create: `server/tests/complaints.routes.test.js`
- Create: `server/tests/map.routes.test.js`
- Create: `server/tests/admin.routes.test.js`
- Create: `server/tests/error-handling.test.js`
- Modify only if tests expose real blockers: `server/app.js`, route files, controllers, middleware, and service entrypoints

### Workspace files to create or modify

- Modify: `package.json`
- Modify: `README.md` only if test commands or coverage instructions need updating

---

### Task 1: Add shared client test infrastructure

**Files:**
- Modify: `client/package.json`
- Create: `client/src/test/setup.js`
- Create: `client/src/test/renderApp.jsx`
- Test: `client/src/App.test.jsx`

- [ ] **Step 1: Write the failing infrastructure test expectation**

Update `client/src/App.test.jsx` so it imports a shared `renderApp` helper that does not exist yet.

```jsx
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderApp } from './test/renderApp.jsx';

describe('App shell', () => {
  it('renders the landing page tagline', () => {
    renderApp('/');
    expect(screen.getByText('Fix it faster.', { exact: false })).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test --workspace client -- src/App.test.jsx`

Expected: FAIL with module resolution error for `./test/renderApp.jsx`

- [ ] **Step 3: Write minimal shared test setup**

Update `client/package.json` to load a shared setup file:

```json
{
  "scripts": {
    "test": "vitest run --setupFiles src/test/setup.js"
  }
}
```

Create `client/src/test/setup.js`:

```js
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});
```

Create `client/src/test/renderApp.jsx`:

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '../App.jsx';

export function renderApp(initialEntry = '/') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test --workspace client -- src/App.test.jsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add client/package.json client/src/test/setup.js client/src/test/renderApp.jsx client/src/App.test.jsx
git commit -m "test: add shared client test harness"
```

### Task 2: Add high-value client page tests

**Files:**
- Create: `client/src/pages/Home.test.jsx`
- Create: `client/src/pages/Report.test.jsx`
- Create: `client/src/pages/Login.test.jsx`
- Create: `client/src/pages/MyComplaints.test.jsx`
- Create: `client/src/pages/Dashboard.test.jsx`
- Create: `client/src/pages/Analytics.test.jsx`
- Create: `client/src/pages/Map.test.jsx`
- Modify only if required by failing tests: corresponding page files and hooks they depend on

- [ ] **Step 1: Write failing tests for core page behaviors**

Add route-level tests that target real branches:

`client/src/pages/Home.test.jsx`

```jsx
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderApp } from '../test/renderApp.jsx';

describe('Home page', () => {
  it('shows the hero headline and primary reporting CTA', () => {
    renderApp('/');
    expect(screen.getByText('Fix it faster.', { exact: false })).toBeTruthy();
    expect(screen.getByRole('button', { name: /report water issue/i })).toBeTruthy();
  });
});
```

`client/src/pages/Report.test.jsx`

```jsx
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Report from './Report.jsx';
import { useAuthStore } from '../store/authStore.js';
import { api } from '../lib/api.js';

vi.mock('../hooks/useGeolocation.js', () => ({
  useGeolocation: () => ({
    coords: { latitude: 17.385, longitude: 78.4867 },
    error: '',
    setCoords: vi.fn()
  })
}));

vi.mock('../components/map/LeafletBaseMap.jsx', () => ({
  LeafletBaseMap: () => <div>Mock map</div>
}));

describe('Report page', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null });
  });

  it('redirects unauthenticated users to login when submitting', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <Report />
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Broken pipeline leaking water near the main road.' }
    });

    fireEvent.click(screen.getByRole('button', { name: /submit complaint/i }));

    await waitFor(() => {
      expect(screen.getByText(/login is required/i)).toBeTruthy();
    });
  });

  it('renders a success state after a valid complaint submission', async () => {
    useAuthStore.setState({ user: { id: 'u1', name: 'Asha', role: 'CITIZEN' }, accessToken: 'token' });
    vi.spyOn(api, 'post').mockResolvedValue({
      data: {
        data: { id: 'CMP-1', aiSeverity: 'HIGH', aiPriority: 'URGENT', aiSummary: 'Pipe leak confirmed' }
      }
    });

    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <Report />
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Broken pipeline leaking water near the main road for several hours.' }
    });

    fireEvent.click(screen.getByRole('button', { name: /submit complaint/i }));

    await waitFor(() => {
      expect(screen.getByText(/complaint submitted/i)).toBeTruthy();
      expect(screen.getByText(/CMP-1/i)).toBeTruthy();
    });
  });
});
```

Apply the same style to `Login`, `MyComplaints`, `Dashboard`, `Analytics`, and `Map` for each page’s meaningful empty state, loading state, gated state, or rendered data path.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test --workspace client -- src/pages/Home.test.jsx src/pages/Report.test.jsx src/pages/Login.test.jsx src/pages/MyComplaints.test.jsx src/pages/Dashboard.test.jsx src/pages/Analytics.test.jsx src/pages/Map.test.jsx`

Expected: FAIL due to missing test files, missing seams, or behavior mismatches

- [ ] **Step 3: Implement minimal production or test-only support**

Make the smallest changes required to support these tests without broad refactors. Likely examples:

```js
// Example seam in a hook file
export function createComplaintsQueryOptions(apiClient = api) {
  return {
    queryKey: ['complaints'],
    queryFn: async () => {
      const response = await apiClient.get('/complaints/mine');
      return response.data.data;
    }
  };
}
```

or:

```jsx
// Example accessible label fix if missing
<textarea
  aria-label="Description"
  ...
/>
```

Only apply these if the tests show they are required.

- [ ] **Step 4: Run tests to verify they pass**

Run the same command from Step 2.

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add client/src/pages/*.test.jsx client/src/pages client/src/hooks client/src/lib
git commit -m "test: cover client page flows"
```

### Task 3: Add shared component behavior tests

**Files:**
- Create: `client/src/components/layout/Navbar.test.jsx`
- Create: `client/src/components/complaints/ComplaintCard.test.jsx`
- Create: `client/src/components/complaints/StatusTimeline.test.jsx`
- Create: `client/src/components/ui/OfflineBanner.test.jsx`
- Modify only if required by failing tests: corresponding component files

- [ ] **Step 1: Write failing tests for branching component behavior**

`client/src/components/layout/Navbar.test.jsx`

```jsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navbar } from './Navbar.jsx';
import { useAuthStore } from '../../store/authStore.js';

describe('Navbar', () => {
  it('shows login when no user is present', () => {
    useAuthStore.setState({ user: null, accessToken: null });
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByRole('link', { name: /login/i })).toBeTruthy();
  });

  it('shows the current user name and logout when authenticated', () => {
    useAuthStore.setState({ user: { name: 'Asha', role: 'CITIZEN' }, accessToken: 'token' });
    render(<MemoryRouter><Navbar /></MemoryRouter>);
    expect(screen.getByText('Asha')).toBeTruthy();
    expect(screen.getByRole('button', { name: /logout/i })).toBeTruthy();
  });
});
```

Add analogous tests for complaint card severity/status rendering, status timeline stage rendering, and offline banner visibility.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test --workspace client -- src/components/layout/Navbar.test.jsx src/components/complaints/ComplaintCard.test.jsx src/components/complaints/StatusTimeline.test.jsx src/components/ui/OfflineBanner.test.jsx`

Expected: FAIL before implementation

- [ ] **Step 3: Write minimal implementation fixes if needed**

Only apply small fixes required by test evidence, for example:

```jsx
// Example accessible status label
<span aria-label={`severity-${severity.toLowerCase()}`}>{severity}</span>
```

or:

```js
// Example offline hook seam
export function readNavigatorOnline(navigatorObject = navigator) {
  return navigatorObject.onLine;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run the same command from Step 2.

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add client/src/components/**/*.test.jsx client/src/components client/src/hooks
git commit -m "test: cover shared client component behavior"
```

### Task 4: Add server route and auth test seams

**Files:**
- Create: `server/tests/helpers/mockModules.js`
- Create: `server/tests/auth.routes.test.js`
- Modify only if required by failing tests: `server/app.js`, `server/routes/auth.js`, `server/controllers/authController.js`, `server/utils/prisma.js`, `server/utils/tokens.js`

- [ ] **Step 1: Write failing auth route tests**

`server/tests/auth.routes.test.js`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

test('POST /api/auth/register validates required fields', async () => {
  const response = await request(createApp()).post('/api/auth/register').send({});
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
});

test('POST /api/auth/login rejects invalid credentials', async () => {
  const response = await request(createApp()).post('/api/auth/login').send({
    email: 'missing@example.com',
    password: 'wrong-password'
  });

  assert.equal(response.statusCode, 401);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test --workspace server -- server/tests/auth.routes.test.js`

Expected: FAIL because deterministic mocks or seams are missing

- [ ] **Step 3: Create minimal mockable boundaries**

Create `server/tests/helpers/mockModules.js`:

```js
export function mockPrisma(overrides = {}) {
  return {
    user: {
      findUnique: async () => null,
      create: async ({ data }) => ({ id: 'user-1', ...data }),
      ...overrides.user
    },
    complaint: {
      findMany: async () => [],
      create: async ({ data }) => ({ id: 'complaint-1', ...data }),
      ...overrides.complaint
    }
  };
}
```

If needed, update server modules so app dependencies can be injected or imported through thin wrappers instead of hard-coded globals.

- [ ] **Step 4: Run tests to verify they pass**

Run the same command from Step 2.

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/tests/helpers/mockModules.js server/tests/auth.routes.test.js server/app.js server/controllers/authController.js server/utils
git commit -m "test: add auth route test seams"
```

### Task 5: Add complaint and map route integration tests

**Files:**
- Create: `server/tests/complaints.routes.test.js`
- Create: `server/tests/map.routes.test.js`
- Modify only if required by failing tests: `server/routes/complaints.js`, `server/routes/map.js`, `server/controllers/complaintsController.js`, `server/services/storage.js`, `server/services/aiAnalysis.js`

- [ ] **Step 1: Write failing complaint and map route tests**

`server/tests/complaints.routes.test.js`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

test('POST /api/complaints rejects unauthenticated submission', async () => {
  const response = await request(createApp()).post('/api/complaints').send({
    issueType: 'LEAKAGE',
    description: 'Pipe leak near the market with heavy water loss.',
    latitude: 17.385,
    longitude: 78.4867
  });

  assert.equal(response.statusCode, 401);
});

test('GET /api/complaints/mine returns a citizen complaint list for an authenticated user', async () => {
  const response = await request(createApp()).get('/api/complaints/mine').set('Authorization', 'Bearer test-token');
  assert.equal(response.statusCode, 200);
  assert.equal(Array.isArray(response.body.data), true);
});
```

`server/tests/map.routes.test.js`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

test('GET /api/map/complaints returns public complaint markers', async () => {
  const response = await request(createApp()).get('/api/map/complaints');
  assert.equal(response.statusCode, 200);
  assert.equal(Array.isArray(response.body.data), true);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test --workspace server -- server/tests/complaints.routes.test.js server/tests/map.routes.test.js`

Expected: FAIL before complaint/map dependencies are stabilized

- [ ] **Step 3: Write minimal implementation or seam changes**

Apply only targeted changes required by test evidence, for example:

```js
// Example injectable dependency wrapper
export function getAnalysisService(service = aiAnalysisService) {
  return service;
}
```

or:

```js
// Example auth seam
export function readAccessToken(headers) {
  return headers.authorization?.replace(/^Bearer\s+/i, '') ?? null;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run the same command from Step 2.

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/tests/complaints.routes.test.js server/tests/map.routes.test.js server/controllers server/routes server/services server/middleware
git commit -m "test: cover complaint and map route flows"
```

### Task 6: Add admin and error-handling route tests

**Files:**
- Create: `server/tests/admin.routes.test.js`
- Create: `server/tests/error-handling.test.js`
- Modify: `server/tests/app.test.js`
- Modify only if required by failing tests: `server/routes/admin.js`, `server/controllers/adminController.js`, `server/middleware/errorHandler.js`, `server/middleware/auth.js`

- [ ] **Step 1: Write failing admin and error-path tests**

`server/tests/admin.routes.test.js`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

test('GET /api/admin/complaints rejects unauthenticated access', async () => {
  const response = await request(createApp()).get('/api/admin/complaints');
  assert.equal(response.statusCode, 401);
});

test('GET /api/admin/analytics/summary returns analytics data for an admin token', async () => {
  const response = await request(createApp()).get('/api/admin/analytics/summary').set('Authorization', 'Bearer admin-token');
  assert.equal(response.statusCode, 200);
});
```

`server/tests/error-handling.test.js`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

test('unknown routes return a 404 payload', async () => {
  const response = await request(createApp()).get('/api/unknown');
  assert.equal(response.statusCode, 404);
  assert.equal(response.body.success, false);
});
```

Expand `server/tests/app.test.js` to include the allowed-origin health path or other app-shell middleware behavior that matters.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test --workspace server -- server/tests/admin.routes.test.js server/tests/error-handling.test.js server/tests/app.test.js`

Expected: FAIL before admin mocks and error assertions are aligned

- [ ] **Step 3: Write minimal implementation fixes**

Apply only small correctness or seam fixes required by the test output.

```js
// Example standardized not-found payload
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run the same command from Step 2.

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add server/tests/admin.routes.test.js server/tests/error-handling.test.js server/tests/app.test.js server/controllers server/middleware server/routes
git commit -m "test: cover admin and error handling routes"
```

### Task 7: Add full verification and coverage commands

**Files:**
- Modify: `client/package.json`
- Modify: `server/package.json`
- Modify: `package.json`
- Modify: `README.md` if command documentation needs to be updated

- [ ] **Step 1: Write the failing command expectations**

Add root scripts that assume coverage commands exist before they are fully wired:

```json
{
  "scripts": {
    "test:client": "npm run test --workspace client",
    "test:server": "npm run test --workspace server",
    "test:coverage": "npm run test:coverage --workspace client && npm run test:coverage --workspace server"
  }
}
```

- [ ] **Step 2: Run commands to verify they fail**

Run: `npm run test:coverage`

Expected: FAIL because coverage scripts do not exist yet

- [ ] **Step 3: Add minimal coverage scripts**

Update `client/package.json`:

```json
{
  "scripts": {
    "test": "vitest run --setupFiles src/test/setup.js",
    "test:coverage": "vitest run --setupFiles src/test/setup.js --coverage"
  }
}
```

Update `server/package.json`:

```json
{
  "scripts": {
    "test": "node --test",
    "test:coverage": "node --test --experimental-test-coverage"
  }
}
```

Update root `package.json`:

```json
{
  "scripts": {
    "test": "npm run test --workspace server && npm run test --workspace client",
    "test:coverage": "npm run test:coverage --workspace server && npm run test:coverage --workspace client"
  }
}
```

- [ ] **Step 4: Run tests and coverage to verify they pass**

Run:

`npm run test`

Expected: PASS across server and client

Run:

`npm run test:coverage`

Expected: PASS across server and client with coverage output emitted

- [ ] **Step 5: Commit**

```bash
git add package.json client/package.json server/package.json README.md
git commit -m "test: add workspace coverage commands"
```

### Task 8: Final verification and publish to `code.swecha.org`

**Files:**
- Modify only if any prior verification step still fails

- [ ] **Step 1: Run the full verification suite**

Run:

`npm run test`

Expected: PASS

Run:

`npm run test:coverage`

Expected: PASS

- [ ] **Step 2: Check working tree is clean except intended changes**

Run: `git status --short`

Expected: only intended test-suite changes remain staged or committed

- [ ] **Step 3: Push to the primary repository**

Run:

`git push origin main`

Expected: push to `https://code.swecha.org/Kamel/waterwatch.git` succeeds

- [ ] **Step 4: Verify remote push target**

Run: `git remote -v`

Expected: `origin` still points to `code.swecha.org/Kamel/waterwatch.git`

- [ ] **Step 5: Final commit if a last fix was needed**

```bash
git add .
git commit -m "test: finalize WaterWatch coverage suite"
git push origin main
```
