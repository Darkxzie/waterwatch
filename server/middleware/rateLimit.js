import rateLimit from 'express-rate-limit';

export const complaintRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    error: 'Too many complaint submissions. Try again later.',
  },
});
