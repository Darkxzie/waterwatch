import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

test('GET /api/health returns success payload', async () => {
  const response = await request(createApp()).get('/api/health');

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.status, 'ok');
});

test('GET /api/health allows a configured frontend origin', async () => {
  const response = await request(createApp()).get('/api/health').set('Origin', 'http://localhost:5173');

  assert.equal(response.statusCode, 200);
  assert.equal(response.headers['access-control-allow-origin'], 'http://localhost:5173');
});
