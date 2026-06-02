import { describe, expect, it } from 'vitest';
import { truncate } from './truncate.js';

describe('truncate', () => {
  it('returns the original value when it is short enough', () => {
    expect(truncate('short text', 20)).toBe('short text');
  });

  it('adds an ellipsis when the value exceeds the max length', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcde...');
  });
});
