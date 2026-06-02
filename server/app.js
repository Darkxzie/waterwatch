import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import './utils/loadEnv.js';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import mapRoutes from './routes/map.js';
import adminRoutes from './routes/admin.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  const configuredOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:4173',
    'http://localhost:4174',
    'http://localhost:4175',
  ].filter(Boolean);

  app.use(
    cors({
      origin(origin, callback) {
        if (
          !origin ||
          configuredOrigins.includes(origin) ||
          /localhost\.run|loca\.lt|pages\.swecha|code\.swecha/i.test(origin)
        ) {
          return callback(null, true);
        }

        return callback(new Error('CORS origin not allowed'));
      },
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok' } });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/complaints', complaintRoutes);
  app.use('/api/map', mapRoutes);
  app.use('/api/admin', adminRoutes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
