import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ajout d'alias pour simplifier les imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 800,
  },
  server: {
    // Replit requires port 5000 for webview and 0.0.0.0 host
    host: '0.0.0.0',
    port: 5000,
    // Allow all hosts for Replit proxy support (user sees iframe of localhost)
    allowedHosts: true,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false, // Utile pour éviter les erreurs SSL en dev
      },
    },
  },
});