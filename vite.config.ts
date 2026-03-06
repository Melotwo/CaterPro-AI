import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      'firebase/app': '@firebase/app',
      'firebase/auth': '@firebase/auth',
      'firebase/firestore': '@firebase/firestore',
      'firebase/storage': '@firebase/storage',
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          icons: ['lucide-react'],
          pdf: ['jspdf', 'html2canvas'],
          ai: ['@google/genai'],
          firebase: ['@firebase/app', '@firebase/auth', '@firebase/firestore', '@firebase/storage']
        }
      }
    }
  },
  define: {
    // Expose environment variables to the client, with a safe fallback
  }
})
