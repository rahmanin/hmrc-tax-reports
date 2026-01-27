export type RetryOptions = {
  retries: number; // number of extra attempts after first one
  delayMs?: number; // fixed delay
  shouldRetry?: (err: unknown, attempt: number) => boolean; // attempt starts at 1
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function retry<T>(
  fn: (attempt: number) => Promise<T>,
  opts: RetryOptions,
): Promise<T> {
  const { retries, delayMs = 0, shouldRetry } = opts;

  if (!Number.isInteger(retries) || retries < 0)
    throw new Error('INVALID_RETRIES');
  if (!Number.isFinite(delayMs) || delayMs < 0)
    throw new Error('INVALID_DELAY_MS');

  let lastErr: unknown;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;

      const canRetryByPolicy = shouldRetry ? shouldRetry(err, attempt) : true;
      const hasMoreAttempts = attempt <= retries;

      if (!hasMoreAttempts || !canRetryByPolicy) throw err;
      if (delayMs > 0) await sleep(delayMs);
    }
  }

  // unreachable, but TS-friendly
  throw lastErr;
}
