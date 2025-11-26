import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(() => {
  const plugins = [react()];

  if (process.env.ANALYZE === 'true') {
    plugins.push(
      visualizer({
        filename: 'bundle-report.html',
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        open: false,
      })
    );
  }

  return {
    plugins,
    test: {
      environment: 'jsdom',
      globals: true,
      passWithNoTests: true,
      setupFiles: './src/setupTests.js',
      env: {
        // Ensure Vitest/CI always supplies the required API base URL via env vars.
        VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || 'http://localhost:3001',
      },
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        reportsDirectory: 'coverage',
        include: ['src/**/*.{js,jsx,ts,tsx}'],
        exclude: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  };
});
