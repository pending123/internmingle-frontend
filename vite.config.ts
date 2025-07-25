/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(new URL('.', import.meta.url)));

export default defineConfig({
  base: '/'.
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, 'src'),  // '@' points to your src folder
    },
  },
  test: {
    // your test config here
  },
});
