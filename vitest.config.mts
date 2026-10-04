import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * El dominio es TypeScript puro: no necesita jsdom ni React Testing Library.
 * Solo se carga `environment: 'node'` y el alias `@/*` de tsconfig.
 */
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      reportsDirectory: 'coverage',
      include: ['domain/**/*.ts', 'application/**/*.ts'],
    },
  },
});
