import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth']
        },
        // Add hash to filenames for cache busting
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      external: ['canvg', 'html2canvas', 'dompurify']
    },
    commonjsOptions: {
      ignore: ['canvg']
    }
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    open: false,
    cors: true
  },
  preview: {
    port: 4173,
    host: true,
    historyApiFallback: true
  },
  optimizeDeps: {
    exclude: ['canvg']
  }
})
