import { describe, it, expect, vi } from 'vitest';

describe('kata: async error pitfalls (forgotten await, unhandled rejections)', () => {
  it('try/catch does NOT catch async errors if you forgot to await', async () => {
    vi.useFakeTimers();

    async function hmrcCallThatFails(): Promise<void> {
      return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('HMRC 500')), 10);
      });
    }

    const unhandled: unknown[] = [];
    const handler = (reason: unknown) => unhandled.push(reason);

    process.on('unhandledRejection', handler);
    /**
     * NOTE:
     * We intentionally trigger an unhandled rejection,
     * but capture it explicitly to keep the test runner stable.
     */
    try {
      void hmrcCallThatFails();
    } catch {}

    await vi.advanceTimersByTimeAsync(10);
    await Promise.resolve();

    process.off('unhandledRejection', handler);

    expect(unhandled).toHaveLength(1);
    expect((unhandled[0] as Error).message).toBe('HMRC 500');

    vi.useRealTimers();
  });

  it('unhandled rejection can be captured and should fail loudly (deterministic)', async () => {
    vi.useFakeTimers();

    async function hmrcCallThatFails(): Promise<void> {
      return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('HMRC timeout')), 10);
      });
    }

    const unhandled: unknown[] = [];
    const handler = (reason: unknown) => unhandled.push(reason);

    process.on('unhandledRejection', handler);

    void hmrcCallThatFails();

    await vi.advanceTimersByTimeAsync(10);
    await Promise.resolve();

    process.off('unhandledRejection', handler);

    expect(unhandled).toHaveLength(1);
    expect((unhandled[0] as Error).message).toContain('HMRC timeout');

    vi.useRealTimers();
  });

  it('lost stack traces: rethrowing new Error hides original unless you preserve cause', async () => {
    async function lowLevelCall(): Promise<void> {
      throw new Error('Socket hang up');
    }

    async function hmrcClientBad(): Promise<void> {
      try {
        await lowLevelCall();
      } catch {
        throw new Error('HMRC client failed');
      }
    }

    async function hmrcClientGood(): Promise<void> {
      try {
        await lowLevelCall();
      } catch (err) {
        throw new Error('HMRC client failed', { cause: err });
      }
    }

    await expect(hmrcClientBad()).rejects.toThrow('HMRC client failed');

    try {
      await hmrcClientGood();
    } catch (e) {
      const err = e as Error & { cause?: unknown };
      expect(err.message).toBe('HMRC client failed');
      expect((err.cause as Error).message).toBe('Socket hang up');
    }
  });
});
