import Fastify from 'fastify';
import cors from '@fastify/cors';
import { getHealth } from './health';
import { config } from './config';

const server = Fastify({
  logger: false,
});

const corsOrigin = config.CORS_ORIGIN;
const port = config.PORT;

await server.register(cors, {
  origin: corsOrigin ? corsOrigin.split(',') : false,
});

server.get('/health', async () => {
  return getHealth();
});

try {
  await server.listen({ port, host: '0.0.0.0' });
  console.log(`[api] listening on http://localhost:${port} (logLevel=${config.LOG_LEVEL})`);
} catch (err) {
  console.error('[api] failed to start', err);
  process.exit(1);
}
