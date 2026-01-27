import { describe, it, expect, vi } from 'vitest';

describe('kata: event loop ordering (microtasks vs macrotasks)', () => {
  it('Promise.then (microtask) runs before setTimeout (macrotask)', async () => {
    vi.useFakeTimers();

    const log: string[] = [];

    log.push('sync:start');

    Promise.resolve().then(() => {
      log.push('microtask:promise-then');
    });

    setTimeout(() => {
      log.push('macrotask:timeout-0');
    }, 0);

    log.push('sync:end');

    expect(log).toEqual(['sync:start', 'sync:end']);

    await Promise.resolve();
    expect(log).toEqual(['sync:start', 'sync:end', 'microtask:promise-then']);

    await vi.runAllTimersAsync();
    expect(log).toEqual([
      'sync:start',
      'sync:end',
      'microtask:promise-then',
      'macrotask:timeout-0',
    ]);

    vi.useRealTimers();
  });

  it('queueMicrotask behaves like microtask and runs before timers', async () => {
    vi.useFakeTimers();

    const log: string[] = [];

    queueMicrotask(() => log.push('microtask:queueMicrotask'));
    setTimeout(() => log.push('macrotask:setTimeout'), 0);

    await Promise.resolve();
    expect(log).toEqual(['microtask:queueMicrotask']);

    await vi.runAllTimersAsync();
    expect(log).toEqual(['microtask:queueMicrotask', 'macrotask:setTimeout']);

    vi.useRealTimers();
  });
});
