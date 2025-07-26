import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        '**/*.config.*',

        // Excluding some files that are either not relevant to the test coverage
        // or are covered by the E2E tests
        'src/api/axios-instance.ts',
        'src/app/layout.tsx',
        'src/app/payin/**',
        'src/lib/schemas/**',
      ],
    },
  },
});
