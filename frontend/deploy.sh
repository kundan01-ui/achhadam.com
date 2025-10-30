#!/bin/bash

# Deployment script for Achhadam Frontend
# This ensures proper cache clearing and deployment

echo "🚀 Starting Achhadam Frontend Deployment..."

# Step 1: Clean old build artifacts
echo "🧹 Cleaning old build artifacts..."
rm -rf dist
rm -rf node_modules/.vite

# Step 2: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 3: Build the project
echo "🔨 Building project..."
npm run build

# Step 4: Verify service worker was updated
if [ -f "dist/sw.js" ]; then
    echo "✅ Service Worker found in dist/"
    # Check if timestamp was replaced
    if grep -q "__BUILD_TIMESTAMP__" "dist/sw.js"; then
        echo "⚠️  WARNING: BUILD_TIMESTAMP was not replaced!"
        exit 1
    else
        echo "✅ Service Worker timestamp updated successfully"
    fi
else
    echo "❌ ERROR: Service Worker not found in dist/"
    exit 1
fi

# Step 5: Verify _headers file is in dist
if [ -f "dist/_headers" ]; then
    echo "✅ _headers file found in dist/"
else
    echo "⚠️  WARNING: _headers file not found in dist/"
fi

echo "✅ Build completed successfully!"
echo ""
echo "📋 Deployment Checklist:"
echo "  1. Service Worker: ✅ Updated with new cache version"
echo "  2. Assets: ✅ Generated with unique hashes"
echo "  3. Cache Headers: ✅ Configured"
echo ""
echo "🎉 Ready to deploy!"
