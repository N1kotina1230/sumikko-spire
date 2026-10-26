import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// GitHub Actions supplies /<repository>/; root-hosted Sites keep the default /.
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  build: { target: 'es2022' },
});
