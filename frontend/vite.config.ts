import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to copy headers file
const headersPlugin = () => ({
  name: 'headers-plugin',
  closeBundle: async () => {
    const distDir = path.resolve(__dirname, 'dist');
    const headersPath = path.join(__dirname, 'public', '_headers');
    const distHeadersPath = path.join(distDir, '_headers');

    // Copy _headers file to dist if it exists
    if (fs.existsSync(headersPath)) {
      fs.copyFileSync(headersPath, distHeadersPath);
      console.log('✅ _headers file copied to dist/');
    } else {
      console.log('⚠️ No _headers file found in public/');
    }

    console.log('✅ Build complete with cache-busting enabled!');
    console.log('📝 Version will be generated at runtime using Date.now()');
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    headersPlugin()
  ],
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
        // Add hash to filenames for cache busting - VERY IMPORTANT
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
