import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(currentDir, '..');
const repoRoot = path.resolve(serverDir, '..');
const envFilenames = process.env.NODE_ENV === 'test' ? ['.env.test', '.env'] : ['.env'];

const candidates = envFilenames.flatMap((filename) => [
  path.join(process.cwd(), filename),
  path.join(serverDir, filename),
  path.join(repoRoot, filename),
]);

for (const envPath of candidates) {
  const result = dotenv.config({ path: envPath, override: false });
  if (!result.error) {
    break;
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not configured. Create a .env file in the repository root.');
}
