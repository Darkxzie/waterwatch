export function getRouterMode({
  mode = import.meta.env.VITE_ROUTER_MODE,
  isDev = import.meta.env.DEV
} = {}) {
  if (mode === 'browser' || mode === 'hash') {
    return mode;
  }

  return isDev ? 'browser' : 'hash';
}
