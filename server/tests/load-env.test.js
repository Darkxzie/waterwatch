import test from 'node:test';
import assert from 'node:assert/strict';

test('loadEnv resolves the repository root .env when executed from the server workspace', async () => {
  const originalDatabaseUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;

  await import('../utils/loadEnv.js');

  assert.equal(process.env.DATABASE_URL?.includes('waterwatch'), true);

  process.env.DATABASE_URL = originalDatabaseUrl;
});
