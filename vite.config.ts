import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
          pdf: ['jspdf', 'html2canvas'],
          ai: ['@google/genai']
        }
      }
    }
  },
  define: {
    // Expose environment variables to the client, with a safe fallback
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
})
