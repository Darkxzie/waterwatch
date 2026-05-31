import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';
import { mockPrisma, resetPrismaMocks } from './helpers/mockModules.js';

beforeEach(() => {
  process.env.JWT_SECRET = 'test-access-secret';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
});

afterEach(() => {
  resetPrismaMocks();
});

test('POST /api/auth/register returns 409 when the email already exists', async () => {
  mockPrisma({
    user: {
      findUnique: async () => ({ id: 'existing-user', email: 'asha@example.com' })
    }
  });

  const response = await request(createApp()).post('/api/auth/register').send({
    name: 'Asha',
    email: 'asha@example.com',
    password: 'SecurePass1'
  });

  assert.equal(response.statusCode, 409);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error, 'Email already registered');
});

test('POST /api/auth/login returns 401 for invalid credentials', async () => {
  mockPrisma({
    user: {
      findUnique: async () => null
    }
  });

  const response = await request(createApp()).post('/api/auth/login').send({
    email: 'missing@example.com',
    password: 'SecurePass1'
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error, 'Invalid email or password');
});

test('POST /api/auth/refresh returns 401 when the refresh token is missing', async () => {
  const response = await request(createApp()).post('/api/auth/refresh');

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.error, 'Refresh token missing');
});

test('POST /api/auth/logout clears the refresh cookie', async () => {
  const response = await request(createApp()).post('/api/auth/logout');

  assert.equal(response.statusCode, 200);
  assert.match(response.headers['set-cookie'][0], /refreshToken=;/);
  assert.equal(response.body.success, true);
});
