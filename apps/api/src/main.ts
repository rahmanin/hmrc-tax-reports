import Fastify from 'fastify';
import cors from '@fastify/cors';
import { getHealth } from './health';
import 'dotenv/config';

const server = Fastify({
  logger: false,
});
const corsOrigin = process.env.CORS_ORIGIN;

await server.register(cors, {
  origin: corsOrigin ? corsOrigin.split(',') : false,
});

server.get('/health', async () => {
  return getHealth();
});

const port = Number(process.env.PORT) || 3000;

try {
  await server.listen({ port, host: '0.0.0.0' });
  console.log(`[api] listening on http://localhost:${port}`);
} catch (err) {
  console.error('[api] failed to start', err);
  process.exit(1);
}
