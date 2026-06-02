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
    address: 'Ameerpet',
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.error, 'Authentication required');
});

test('GET /api/complaints/mine returns the authenticated user complaint list', async () => {
  mockPrisma({
    complaint: {
      findMany: async () => [{ id: 'cmp-1', description: 'Stored complaint', status: 'PENDING' }],
      count: async () => 1,
    },
  });

  const response = await request(createApp())
    .get('/api/complaints/mine')
    .set('Authorization', `Bearer ${signToken()}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(Array.isArray(response.body.data), true);
  assert.equal(response.body.data.length, 1);
});

test('POST /api/complaints creates a complaint with heuristic AI analysis', async () => {
  mockPrisma({
    complaint: {
      create: async ({ data }) => ({ id: 'cmp-created', status: 'PENDING', ...data }),
    },
  });

  const response = await request(createApp())
    .post('/api/complaints')
    .set('Authorization', `Bearer ${signToken()}`)
    .field('issueType', 'DIRTY_WATER')
    .field('description', 'Dirty brown water is coming from the taps in our lane.')
    .field('latitude', '17.385')
    .field('longitude', '78.4867')
    .field('address', 'Ameerpet')
    .attach('photo', Buffer.from('demo-image'), {
      filename: 'lane photo.png',
      contentType: 'image/png',
    });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.aiCategory, 'DIRTY_WATER');
  assert.equal(response.body.data.aiStatus, 'COMPLETED');
  assert.match(response.body.data.photoUrl, /^data:image\/png;base64,/);
});

test('POST /api/complaints rejects unsupported upload types', async () => {
  const response = await request(createApp())
    .post('/api/complaints')
    .set('Authorization', `Bearer ${signToken()}`)
    .field('issueType', 'PIPE_LEAK')
    .field('description', 'Pipe leak near the market with heavy water loss.')
    .field('latitude', '17.385')
    .field('longitude', '78.4867')
    .field('address', 'Ameerpet')
    .attach('photo', Buffer.from('not-an-image'), {
      filename: 'notes.txt',
      contentType: 'text/plain',
    });

  assert.equal(response.statusCode, 500);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error, 'Only JPEG, PNG, and WEBP images are allowed');
});

test('GET /api/complaints/:id returns the authenticated user complaint', async () => {
  mockPrisma({
    complaint: {
      findFirst: async () => ({ id: 'cmp-1', description: 'Stored complaint', status: 'PENDING' }),
    },
  });

  const response = await request(createApp())
    .get('/api/complaints/cmp-1')
    .set('Authorization', `Bearer ${signToken()}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.id, 'cmp-1');
});

test('POST /api/complaints/:id/upvote increments complaint support', async () => {
  mockPrisma({
    complaint: {
      update: async ({ where }) => ({ id: where.id, upvotes: 4 }),
    },
  });

  const response = await request(createApp())
    .post('/api/complaints/cmp-1/upvote')
    .set('Authorization', `Bearer ${signToken()}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.upvotes, 4);
});
