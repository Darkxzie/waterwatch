import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createApp } from '../app.js';
import { mockPrisma, resetPrismaMocks } from './helpers/mockModules.js';

function signToken(role = 'CITIZEN', sub = 'user-1') {
  return jwt.sign({ sub, role, email: 'citizen@example.com' }, process.env.JWT_SECRET);
}

beforeEach(() => {
  process.env.JWT_SECRET = 'test-access-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
});

afterEach(() => {
  resetPrismaMocks();
});

test('POST /api/complaints rejects unauthenticated submissions', async () => {
  const response = await request(createApp()).post('/api/complaints').send({
    issueType: 'PIPE_LEAK',
    description: 'Pipe leak near the market with heavy water loss.',
    latitude: 17.385,
    longitude: 78.4867,
    address: 'Ameerpet'
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.error, 'Authentication required');
});

test('GET /api/complaints/mine returns the authenticated user complaint list', async () => {
  mockPrisma({
    complaint: {
      findMany: async () => [{ id: 'cmp-1', description: 'Stored complaint', status: 'PENDING' }],
      count: async () => 1
    }
  });

  const response = await request(createApp())
    .get('/api/complaints/mine')
    .set('Authorization', `Bearer ${signToken()}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(Array.isArray(response.body.data), true);
  assert.equal(response.body.data.length, 1);
});
