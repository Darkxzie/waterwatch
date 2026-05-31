import { describe, expect, it } from 'vitest';
import { getRouterMode } from './routerMode.js';

describe('getRouterMode', () => {
  it('uses BrowserRouter during development by default', () => {
    expect(getRouterMode({ isDev: true })).toBe('browser');
  });

  it('uses HashRouter for production static hosting by default', () => {
    expect(getRouterMode({ isDev: false })).toBe('hash');
  });

  it('allows an explicit router mode override', () => {
    expect(getRouterMode({ mode: 'browser', isDev: false })).toBe('browser');
    expect(getRouterMode({ mode: 'hash', isDev: true })).toBe('hash');
  });
});
