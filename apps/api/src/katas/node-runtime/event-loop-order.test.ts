import { describe, it, expect } from 'vitest';

describe('node runtime: event loop ordering', () => {
  it('runs sync first, then microtasks, then macrotasks', async () => {
    const log: string[] = [];

    log.push('sync:start');

    queueMicrotask(() => log.push('microtask:queueMicrotask'));
    void Promise.resolve().then(() => log.push('microtask:promise-then'));

    setTimeout(() => log.push('macrotask:setTimeout'), 0);

    log.push('sync:end');
    expect(log).toEqual(['sync:start', 'sync:end']);

    await Promise.resolve();
    expect(log).toEqual([
      'sync:start',
      'sync:end',
      'microtask:queueMicrotask',
      'microtask:promise-then',
    ]);

    await new Promise<void>((r) => setTimeout(r, 0));
    expect(log).toEqual([
      'sync:start',
      'sync:end',
      'microtask:queueMicrotask',
      'microtask:promise-then',
      'macrotask:setTimeout',
    ]);
  });
});
