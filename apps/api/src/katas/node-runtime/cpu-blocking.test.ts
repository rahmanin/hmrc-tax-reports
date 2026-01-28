import { describe, it, expect } from 'vitest';

function burnCpu(iterations: number) {
  let x = 0;
  for (let i = 0; i < iterations; i++) x += i;
  return x;
}

describe('node runtime: CPU blocking', () => {
  it('CPU-heavy sync work delays microtasks/macrotasks (they run only after sync finishes)', async () => {
    const log: string[] = [];

    setTimeout(() => log.push('timer'), 0);
    queueMicrotask(() => log.push('microtask'));

    log.push('before:cpu');
    burnCpu(20_000_000); // just heavy enough, but deterministic order
    log.push('after:cpu');

    await Promise.resolve();
    expect(log).toEqual(['before:cpu', 'after:cpu', 'microtask']);

    await new Promise<void>((r) => setTimeout(r, 0));
    expect(log).toEqual(['before:cpu', 'after:cpu', 'microtask', 'timer']);
  });
});
