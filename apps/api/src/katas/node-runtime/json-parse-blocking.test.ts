import { describe, it, expect } from 'vitest';

function makeHugeJsonString(count: number) {
  // ["aaaa...", "aaaa...", ...]
  const arr = Array.from({ length: count }, () => 'a'.repeat(50));
  return JSON.stringify(arr);
}

describe('node runtime: JSON.parse blocking', () => {
  it('JSON.parse is sync and blocks microtasks/timers until finished', async () => {
    const log: string[] = [];
    const payload = makeHugeJsonString(200_000); // big enough to be "heavy"

    setTimeout(() => log.push('timer'), 0);
    queueMicrotask(() => log.push('microtask'));

    log.push('before:parse');
    const data = JSON.parse(payload) as unknown[];
    log.push(`after:parse:${data.length}`);

    await Promise.resolve();
    expect(log[0]).toBe('before:parse');
    expect(log[1]).toMatch(/^after:parse:/);
    expect(log[2]).toBe('microtask');

    await new Promise<void>((r) => setTimeout(r, 0));
    expect(log[3]).toBe('timer');
  });
});
