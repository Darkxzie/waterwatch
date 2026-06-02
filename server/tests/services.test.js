import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeComplaint } from '../services/aiAnalysis.js';
import { uploadImage } from '../services/storage.js';

test('analyzeComplaint classifies water outages when no API key is configured', async () => {
  delete process.env.ANTHROPIC_API_KEY;

  const result = await analyzeComplaint({
    issueType: 'NO_WATER_SUPPLY',
    description: 'There is no water in our colony and the outage has lasted all day.',
    imageBase64: null,
  });

  assert.equal(result.category, 'NO_WATER_SUPPLY');
  assert.equal(result.priority, 'IMMEDIATE');
});

test('analyzeComplaint classifies dirty water when no API key is configured', async () => {
  delete process.env.ANTHROPIC_API_KEY;

  const result = await analyzeComplaint({
    issueType: 'DIRTY_WATER',
    description: 'Brown dirty water is coming from the taps near the school.',
    imageBase64: null,
  });

  assert.equal(result.category, 'DIRTY_WATER');
  assert.equal(result.suggestedDepartment, 'Water Board');
});

test('analyzeComplaint falls back to the reported issue type for general complaints', async () => {
  delete process.env.ANTHROPIC_API_KEY;

  const result = await analyzeComplaint({
    issueType: 'PIPE_LEAK',
    description: 'A regular pipe leak is visible beside the market road.',
    imageBase64: null,
  });

  assert.equal(result.category, 'PIPE_LEAK');
  assert.equal(result.priority, 'MODERATE');
});

test('uploadImage returns null when no file is provided', async () => {
  const result = await uploadImage(null);

  assert.equal(result, null);
});

test('uploadImage encodes an uploaded file as a data URL', async () => {
  const result = await uploadImage({
    mimetype: 'image/png',
    buffer: Buffer.from('demo-image'),
  });

  assert.match(result, /^data:image\/png;base64,/);
});
