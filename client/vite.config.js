import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:5000', // 👈 Adjust backend port if needed
      '/api': 'http://localhost:5000'
    }
  }
});
