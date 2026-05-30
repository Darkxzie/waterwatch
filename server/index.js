import dotenv from 'dotenv';
import { createApp } from './app.js';
import { logger } from './utils/logger.js';
import { prisma } from './utils/prisma.js';

dotenv.config();

const app = createApp();
const port = Number(process.env.PORT || 5000);

const server = app.listen(port, () => {
  logger.info({ message: `WaterWatch API listening on port ${port}` });
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
