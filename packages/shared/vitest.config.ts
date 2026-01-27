import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    testTimeout: 2000,
    hookTimeout: 2000,
    restoreMocks: true,
    clearMocks: true,
    unstubEnvs: true,
  },
});
