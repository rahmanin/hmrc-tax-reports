import { describe, it, expect, vi } from 'vitest';
import { withTimeout, TimeoutError } from './withTimeout';
import { retry } from './retry';
import { runWithConcurrency } from './concurrency';
import { afterEach } from 'vitest';

describe('kata: async utilities (timeout/retry/concurrency)', () => {

  afterEach(() => {
    vi.useRealTimers();
  });

  it('withTimeout resolves when operation finishes in time', async () => {
    vi.useFakeTimers();

    const op = new Promise<string>((resolve) =>
      setTimeout(() => resolve('ok'), 50),
    );
    const p = withTimeout(op, 100);

    await vi.advanceTimersByTimeAsync(50);
    await expect(p).resolves.toBe('ok');

    vi.useRealTimers();
  });

  it('withTimeout rejects with TimeoutError when too slow', async () => {
    vi.useFakeTimers();
  
    const op = new Promise<string>(() => {
      // never settles
    });
  
    const p = withTimeout(op, 50, 'HMRC timeout');
  
    const a1 = expect(p).rejects.toBeInstanceOf(TimeoutError);
    const a2 = expect(p).rejects.toThrow('HMRC timeout');
  
    await vi.advanceTimersByTimeAsync(50);
  
    await a1;
    await a2;
  
    vi.useRealTimers();
  });
  

  it('retry succeeds after transient failures', async () => {
    vi.useFakeTimers();

    let calls = 0;
    const fn = async () => {
      calls += 1;
      if (calls < 3) throw new Error('TRANSIENT');
      return 'ok';
    };

    const p = retry(() => fn(), { retries: 5, delayMs: 10 });

    // two failures + two delays (10ms each) + success
    await vi.advanceTimersByTimeAsync(20);
    await expect(p).resolves.toBe('ok');
    expect(calls).toBe(3);

    vi.useRealTimers();
  });

  it('retry stops when retries exhausted (propagates last error)', async () => {
    vi.useFakeTimers();
  
    let calls = 0;
    const fn = async () => {
      calls += 1;
      throw new Error(`FAIL_${calls}`);
    };
  
    const promise = retry(() => fn(), { retries: 2, delayMs: 5 });
  
    const assertion = expect(promise).rejects.toThrow('FAIL_3');
  
    await vi.advanceTimersByTimeAsync(10);
    await assertion;
  
    expect(calls).toBe(3);
  
    vi.useRealTimers();
  });
  

  it('retry respects shouldRetry policy', async () => {
    vi.useFakeTimers();

    let calls = 0;
    const fn = async () => {
      calls += 1;
      throw new Error('BAD_REQUEST');
    };

    const p = retry(() => fn(), {
      retries: 5,
      delayMs: 10,
      shouldRetry: (err) => (err as Error).message !== 'BAD_REQUEST',
    });

    await expect(p).rejects.toThrow('BAD_REQUEST');
    expect(calls).toBe(1); // no retries

    vi.useRealTimers();
  });

  it('runWithConcurrency preserves order and limits parallelism', async () => {
    vi.useFakeTimers();

    const items = [30, 10, 20, 5];
    let inFlight = 0;
    let maxInFlight = 0;

    const worker = async (ms: number) => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);

      await new Promise<void>((r) => setTimeout(r, ms));

      inFlight -= 1;
      return ms;
    };

    const p = runWithConcurrency(items, 2, worker);

    // run all timers for deterministic completion
    await vi.runAllTimersAsync();

    await expect(p).resolves.toEqual([30, 10, 20, 5]); // order preserved
    expect(maxInFlight).toBeLessThanOrEqual(2);

    vi.useRealTimers();
  });
});
