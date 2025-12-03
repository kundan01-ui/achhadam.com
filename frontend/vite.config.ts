import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to inject version and copy headers
const versionInjectionPlugin = () => ({
  name: 'version-injection-plugin',
  closeBundle: async () => {
    const distDir = path.resolve(__dirname, 'dist');
    const headersPath = path.join(__dirname, 'public', '_headers');
    const distHeadersPath = path.join(distDir, '_headers');

    // Generate unique build timestamp
    const buildTimestamp = Date.now();
    const buildVersion = `v${buildTimestamp}`;
    console.log(`\n🔧 Build Version: ${buildVersion}`);

    // Copy _headers file to dist if it exists
    if (fs.existsSync(headersPath)) {
      fs.copyFileSync(headersPath, distHeadersPath);
      console.log('✅ _headers file copied to dist/');
    }

    // Inject version into all JS files
    const files = fs.readdirSync(path.join(distDir, 'assets')).filter(f => f.endsWith('.js'));
    console.log(`📝 Injecting version into ${files.length} JS files...`);

    for (const file of files) {
      const filePath = path.join(distDir, 'assets', file);
      let content = fs.readFileSync(filePath, 'utf8');
      content = content.replace(/__APP_VERSION__/g, `"${buildVersion}"`);
      fs.writeFileSync(filePath, content, 'utf8');
    }

    console.log('✅ Version injection complete!');
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    versionInjectionPlugin()
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
