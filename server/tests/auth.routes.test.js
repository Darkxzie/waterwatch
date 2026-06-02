import test, { afterEach, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
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
      findUnique: async () => ({ id: 'existing-user', email: 'asha@example.com' }),
    },
  });

  const response = await request(createApp()).post('/api/auth/register').send({
    name: 'Asha',
    email: 'asha@example.com',
    password: 'SecurePass1',
  });

  assert.equal(response.statusCode, 409);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error, 'Email already registered');
});

test('POST /api/auth/register creates a user and sets a refresh cookie', async () => {
  mockPrisma({
    user: {
      findUnique: async () => null,
      create: async ({ data }) => ({ id: 'user-1', role: 'CITIZEN', ...data }),
    },
  });

  const response = await request(createApp()).post('/api/auth/register').send({
    name: 'Asha',
    email: 'asha@example.com',
    password: 'SecurePass1',
  });

  assert.equal(response.statusCode, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.email, 'asha@example.com');
  assert.match(response.headers['set-cookie'][0], /refreshToken=/);
});

test('POST /api/auth/login returns 401 for invalid credentials', async () => {
  mockPrisma({
    user: {
      findUnique: async () => null,
    },
  });

  const response = await request(createApp()).post('/api/auth/login').send({
    email: 'missing@example.com',
    password: 'SecurePass1',
  });

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error, 'Invalid email or password');
});

test('POST /api/auth/login returns an access token for valid credentials', async () => {
  const password = await bcrypt.hash('SecurePass1', 10);
  mockPrisma({
    user: {
      findUnique: async () => ({
        id: 'user-1',
        role: 'CITIZEN',
        name: 'Asha',
        email: 'asha@example.com',
        password,
      }),
    },
  });

  const response = await request(createApp()).post('/api/auth/login').send({
    email: 'asha@example.com',
    password: 'SecurePass1',
  });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.name, 'Asha');
  assert.match(response.headers['set-cookie'][0], /refreshToken=/);
});

test('POST /api/auth/refresh returns 401 when the refresh token is missing', async () => {
  const response = await request(createApp()).post('/api/auth/refresh');

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.error, 'Refresh token missing');
});

test('POST /api/auth/refresh returns 401 for an invalid refresh token', async () => {
  const response = await request(createApp())
    .post('/api/auth/refresh')
    .set('Cookie', 'refreshToken=not-a-valid-token');

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.error, 'Invalid refresh token');
});

test('POST /api/auth/refresh returns 401 when the token user no longer exists', async () => {
  mockPrisma({
    user: {
      findUnique: async () => null,
    },
  });

  const refreshToken = jwt.sign(
    { sub: 'user-404', role: 'CITIZEN' },
    process.env.JWT_REFRESH_SECRET
  );

  const response = await request(createApp())
    .post('/api/auth/refresh')
    .set('Cookie', `refreshToken=${refreshToken}`);

  assert.equal(response.statusCode, 401);
  assert.equal(response.body.error, 'User not found');
});

test('POST /api/auth/refresh returns a new access token for a valid cookie', async () => {
  mockPrisma({
    user: {
      findUnique: async () => ({
        id: 'user-1',
        role: 'CITIZEN',
        name: 'Asha',
        email: 'asha@example.com',
      }),
    },
  });

  const refreshToken = jwt.sign({ sub: 'user-1', role: 'CITIZEN' }, process.env.JWT_REFRESH_SECRET);

  const response = await request(createApp())
    .post('/api/auth/refresh')
    .set('Cookie', `refreshToken=${refreshToken}`);

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.user.id, 'user-1');
});

test('POST /api/auth/logout clears the refresh cookie', async () => {
  const response = await request(createApp()).post('/api/auth/logout');

  assert.equal(response.statusCode, 200);
  assert.match(response.headers['set-cookie'][0], /refreshToken=;/);
  assert.equal(response.body.success, true);
});
