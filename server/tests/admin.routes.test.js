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
      count: async () => 2,
    },
  });

  const response = await request(createApp())
    .get('/api/admin/analytics/summary')
    .set('Authorization', `Bearer ${signToken()}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.totals, 2);
});

test('GET /api/admin/complaints returns the filtered complaint list for admins', async () => {
  mockPrisma({
    complaint: {
      findMany: async () => [
        {
          id: 'cmp-1',
          description: 'Pipe leak on main road',
          status: 'PENDING',
          user: { name: 'Asha', email: 'asha@example.com' },
        },
      ],
      count: async () => 1,
    },
  });

  const response = await request(createApp())
    .get('/api/admin/complaints?status=PENDING&search=road')
    .set('Authorization', `Bearer ${signToken()}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.length, 1);
  assert.equal(response.body.meta.total, 1);
});

test('PATCH /api/admin/complaints/:id/status updates the complaint status', async () => {
  mockPrisma({
    complaint: {
      update: async ({ where, data }) => ({ id: where.id, ...data }),
    },
  });

  const response = await request(createApp())
    .patch('/api/admin/complaints/cmp-1/status')
    .set('Authorization', `Bearer ${signToken()}`)
    .send({ status: 'RESOLVED', adminNotes: 'Valve repaired' });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, 'RESOLVED');
  assert.equal(response.body.data.adminNotes, 'Valve repaired');
});

test('PATCH /api/admin/complaints/:id/assign assigns the complaint and priority', async () => {
  mockPrisma({
    complaint: {
      update: async ({ where, data }) => ({ id: where.id, ...data }),
    },
  });

  const response = await request(createApp())
    .patch('/api/admin/complaints/cmp-1/assign')
    .set('Authorization', `Bearer ${signToken()}`)
    .send({ assignedTo: '550e8400-e29b-41d4-a716-446655440000', priority: 'IMMEDIATE' });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.assignedTo, '550e8400-e29b-41d4-a716-446655440000');
  assert.equal(response.body.data.status, 'ASSIGNED');
});

test('GET /api/admin/analytics/trends returns complaint trends', async () => {
  mockPrisma({
    complaint: {
      findMany: async () => [
        {
          id: 'cmp-1',
          createdAt: '2026-05-31T10:00:00.000Z',
          status: 'PENDING',
          issueType: 'PIPE_LEAK',
        },
      ],
    },
  });

  const response = await request(createApp())
    .get('/api/admin/analytics/trends')
    .set('Authorization', `Bearer ${signToken()}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.length, 1);
});

test('GET /api/admin/analytics/resolution-time returns resolved complaint timings', async () => {
  mockPrisma({
    complaint: {
      findMany: async () => [
        {
          issueType: 'PIPE_LEAK',
          createdAt: '2026-05-30T10:00:00.000Z',
          resolvedAt: '2026-05-31T10:00:00.000Z',
        },
      ],
    },
  });

  const response = await request(createApp())
    .get('/api/admin/analytics/resolution-time')
    .set('Authorization', `Bearer ${signToken()}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.length, 1);
});
