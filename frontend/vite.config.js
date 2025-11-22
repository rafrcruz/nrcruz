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
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        reportsDirectory: 'coverage',
        include: ['src/**/*.{js,jsx,ts,tsx}'],
        exclude: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**'],
      },
    },
  };
});
