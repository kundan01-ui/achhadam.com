import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to handle service worker with timestamp and copy headers
const serviceWorkerPlugin = () => ({
  name: 'service-worker-plugin',
  closeBundle: async () => {
    const distDir = path.resolve(__dirname, 'dist');
    const swPath = path.join(distDir, 'sw.js');
    const publicSwPath = path.join(__dirname, 'public', 'sw.js');
    const headersPath = path.join(__dirname, 'public', '_headers');
    const distHeadersPath = path.join(distDir, '_headers');

    // Generate unique build timestamp
    const buildTimestamp = Date.now();
    console.log(`\n🔧 Injecting build timestamp: ${buildTimestamp}`);

    // Read the source sw.js
    let swContent = fs.readFileSync(publicSwPath, 'utf8');

    // Replace the placeholder with actual timestamp
    swContent = swContent.replace('__BUILD_TIMESTAMP__', buildTimestamp.toString());

    // Write to dist
    fs.writeFileSync(swPath, swContent, 'utf8');

    console.log('✅ Service Worker updated with cache version: achhadam-v' + buildTimestamp);

    // Copy _headers file to dist if it exists
    if (fs.existsSync(headersPath)) {
      fs.copyFileSync(headersPath, distHeadersPath);
      console.log('✅ _headers file copied to dist/');
    }
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    serviceWorkerPlugin()
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
