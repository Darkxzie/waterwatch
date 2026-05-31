import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../app.js';
import { mockPrisma, resetPrismaMocks } from './helpers/mockModules.js';

function signToken(role = 'ADMIN', sub = 'admin-1') {
  return jwt.sign({ sub, role, email: 'admin@example.com' }, process.env.JWT_SECRET);
}

beforeEach(() => {
  process.env.JWT_SECRET = 'test-access-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
});

afterEach(() => {
  resetPrismaMocks();
});

test('GET /api/admin/complaints rejects unauthenticated access', async () => {
  const response = await request(createApp()).get('/api/admin/complaints');

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.error, 'Authentication required');
});

test('GET /api/admin/analytics/summary rejects non-admin roles', async () => {
  const response = await request(createApp())
    .get('/api/admin/analytics/summary')
    .set('Authorization', `Bearer ${signToken('CITIZEN', 'citizen-1')}`);

  assert.equal(response.statusCode, 403);
  assert.equal(response.body.error, 'Insufficient permissions');
});

test('GET /api/admin/analytics/summary returns grouped analytics for an admin token', async () => {
  mockPrisma({
    complaint: {
      groupBy: async ({ by }) => {
        if (by[0] === 'issueType') {
          return [{ issueType: 'PIPE_LEAK', _count: { _all: 2 } }];
        }

        return [{ aiSeverity: 'HIGH', _count: { _all: 2 } }];
      },
      count: async () => 2
    }
  });

  const response = await request(createApp())
    .get('/api/admin/analytics/summary')
    .set('Authorization', `Bearer ${signToken()}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.totals, 2);
});
