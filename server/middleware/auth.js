import { fail } from '../utils/response.js';
import { verifyAccessToken } from '../utils/tokens.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return fail(res, 401, 'Authentication required');
  }

  try {
    req.user = verifyAccessToken(token);
    return next();
  } catch {
    return fail(res, 401, 'Invalid or expired token');
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return fail(res, 403, 'Insufficient permissions');
    }

    return next();
  };
}
