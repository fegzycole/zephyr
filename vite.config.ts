import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve('./src'),
      '@components': resolve('./src/components'),
      '@pages': resolve('./src/pages'),
      '@hooks': resolve('./src/hooks'),
      '@utils': resolve('./src/utils'),
      '@store': resolve('./src/store'),
      '@api': resolve('./src/api'),
      '@assets': resolve('./src/assets'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
