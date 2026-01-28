import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  CORS_ORIGIN: z.string().url().optional(),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // Future HMRC placeholders (optional for now)
  HMRC_BASE_URL: z.string().url().optional(),
  HMRC_CLIENT_ID: z.string().min(1).optional(),
  HMRC_CLIENT_SECRET: z.string().min(1).optional(),
  HMRC_TOKEN_URL: z.string().url().optional(),
});

export type AppConfig = z.infer<typeof envSchema>;
