import { envSchema, type AppConfig } from './schema';
import { rawEnv } from './env';

function formatZodError(err: unknown): string {
  // ZodError has "issues", but we avoid importing ZodError type just for formatting.
  if (typeof err === 'object' && err && 'issues' in err) {
    const issues = (err as { issues: Array<{ path: (string | number)[]; message: string }> }).issues;
    return issues
      .map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
  }
  return String(err);
}

export function loadConfig(): AppConfig {
  const parsed = envSchema.safeParse(rawEnv);

  if (!parsed.success) {
    const msg = formatZodError(parsed.error);
    throw new Error(`[config] Invalid environment configuration:\n${msg}`);
  }

  return parsed.data;
}

export const config: AppConfig = loadConfig();
