import { logger } from '../utils/logger.js';

export function notFoundHandler(_req, res) {
  res.status(404).json({ success: false, data: null, error: 'Route not found' });
}

export function errorHandler(error, _req, res, _next) {
  logger.error({ message: error.message, stack: error.stack });

  if (res.headersSent) {
    return;
  }

  res.status(error.status || 500).json({
    success: false,
    data: null,
    error: error.message || 'Internal server error'
  });
}
