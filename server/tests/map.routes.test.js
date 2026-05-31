import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../app.js';
import { mockPrisma, resetPrismaMocks } from './helpers/mockModules.js';

afterEach(() => {
  resetPrismaMocks();
});

test('GET /api/map/complaints returns public complaint markers', async () => {
  mockPrisma({
    complaint: {
      findMany: async () => [{ id: 'cmp-1', issueType: 'PIPE_LEAK', latitude: 17.385, longitude: 78.4867, address: 'Ameerpet', aiSeverity: 'HIGH', status: 'PENDING' }]
    }
  });

  const response = await request(createApp()).get('/api/map/complaints');

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.length, 1);
});
