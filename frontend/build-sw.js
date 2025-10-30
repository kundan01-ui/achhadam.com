// Build script to inject timestamp into service worker
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const swPath = path.join(distDir, 'sw.js');
const publicSwPath = path.join(__dirname, 'public', 'sw.js');

// Generate timestamp
const buildTimestamp = Date.now();
console.log(`🔧 Build timestamp: ${buildTimestamp}`);

// Copy sw.js from public to dist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read the source sw.js
let swContent = fs.readFileSync(publicSwPath, 'utf8');

// Replace the placeholder with actual timestamp
swContent = swContent.replace('__BUILD_TIMESTAMP__', buildTimestamp.toString());

// Write to dist
fs.writeFileSync(swPath, swContent, 'utf8');

console.log('✅ Service Worker copied and updated with build timestamp');
console.log(`✅ New cache version will be: achhadam-v${buildTimestamp}`);
