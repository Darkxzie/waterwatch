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
