import { describe, it, expect, vi } from 'vitest';

type HmrcResponse = { status: 200; body: { correlationId: string } };

describe('kata: callbacks vs promises vs async/await (HMRC-like client)', () => {
  it('callback style: async result arrives later (and error handling is awkward)', async () => {
    vi.useFakeTimers();

    const log: string[] = [];

    function hmrcCallCb(cb: (err: Error | null, res?: HmrcResponse) => void) {
      setTimeout(() => {
        cb(null, { status: 200, body: { correlationId: 'corr-1' } });
      }, 10);
    }

    hmrcCallCb((_err, res) => {
      log.push(`cb:${res?.body.correlationId}`);
    });

    log.push('after-call');

    expect(log).toEqual(['after-call']);

    await vi.advanceTimersByTimeAsync(10);
    expect(log).toEqual(['after-call', 'cb:corr-1']);

    vi.useRealTimers();
  });

  it('promise style: can be returned/awaited (cleaner control flow)', async () => {
    vi.useFakeTimers();

    function hmrcCallPromise(): Promise<HmrcResponse> {
      return new Promise((resolve) => {
        setTimeout(
          () => resolve({ status: 200, body: { correlationId: 'corr-2' } }),
          10,
        );
      });
    }

    const p = hmrcCallPromise();
    await vi.advanceTimersByTimeAsync(10);

    await expect(p).resolves.toMatchObject({ status: 200 });

    vi.useRealTimers();
  });

  it('async/await: same promise, simplest to read + try/catch works when awaited', async () => {
    vi.useFakeTimers();

    async function hmrcCall(): Promise<HmrcResponse> {
      return new Promise((resolve) => {
        setTimeout(
          () => resolve({ status: 200, body: { correlationId: 'corr-3' } }),
          10,
        );
      });
    }

    const run = async () => {
      const res = await hmrcCall();
      return res.body.correlationId;
    };

    const p = run();
    await vi.advanceTimersByTimeAsync(10);

    await expect(p).resolves.toBe('corr-3');

    vi.useRealTimers();
  });
});
