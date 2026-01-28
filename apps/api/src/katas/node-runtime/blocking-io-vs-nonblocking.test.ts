import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

function makeTempFile(content: string) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'node-kata-'));
  const file = path.join(dir, 'big.txt');
  fs.writeFileSync(file, content);
  return file;
}

describe('node runtime: blocking vs non-blocking I/O', () => {
  it('fs.readFileSync blocks the turn: microtasks/macrotasks run only after sync I/O completes', async () => {
    const file = makeTempFile('x'.repeat(2_000_000)); // 2MB is enough

    const log: string[] = [];

    setTimeout(() => log.push('timer'), 0);
    queueMicrotask(() => log.push('microtask'));

    log.push('before:readFileSync');
    fs.readFileSync(file, 'utf8'); // blocks the event loop
    log.push('after:readFileSync');

    // microtasks run after current call stack finishes
    await Promise.resolve();
    expect(log).toEqual(['before:readFileSync', 'after:readFileSync', 'microtask']);

    // timers run on next macrotask
    await new Promise<void>((r) => setTimeout(r, 0));
    expect(log).toEqual(['before:readFileSync', 'after:readFileSync', 'microtask', 'timer']);
  });

  it('fs.promises.readFile does not block the turn: timer can run while I/O is pending', async () => {
    const file = makeTempFile('x'.repeat(2_000_000));

    const log: string[] = [];

    const p = fsp.readFile(file, 'utf8').then(() => log.push('io:done'));

    setTimeout(() => log.push('timer'), 0);
    queueMicrotask(() => log.push('microtask'));

    log.push('sync:end');

    await Promise.resolve();
    expect(log).toEqual(['sync:end', 'microtask']);

    await new Promise<void>((r) => setTimeout(r, 0));
    // timer should run even if I/O still pending (typical behavior)
    expect(log).toContain('timer');

    await p;
    expect(log).toContain('io:done');
  });
});
