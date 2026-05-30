import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import mapRoutes from './routes/map.js';
import adminRoutes from './routes/admin.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true
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
