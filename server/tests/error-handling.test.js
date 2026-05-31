import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';

test('unknown routes return a standardized 404 payload', async () => {
  const response = await request(createApp()).get('/api/unknown');

  assert.equal(response.statusCode, 404);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error, 'Route not found');
});
