import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import * as defaultConfig from "./envs";

export default defineConfig({
  ...defaultConfig,
  plugins: [react()],
  server: {
    port: 3001,
  },
  build: {
    outDir: 'dist',
  },
});
