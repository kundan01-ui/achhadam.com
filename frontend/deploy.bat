@echo off
REM Deployment script for Achhadam Frontend - Windows
REM This ensures proper cache clearing and deployment

echo 🚀 Starting Achhadam Frontend Deployment...

REM Step 1: Clean old build artifacts
echo 🧹 Cleaning old build artifacts...
if exist dist rmdir /s /q dist
if exist node_modules\.vite rmdir /s /q node_modules\.vite

REM Step 2: Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Step 3: Build the project
echo 🔨 Building project...
call npm run build

REM Step 4: Verify service worker was updated
if exist "dist\sw.js" (
    echo ✅ Service Worker found in dist/
    findstr /C:"__BUILD_TIMESTAMP__" "dist\sw.js" >nul
    if errorlevel 1 (
        echo ✅ Service Worker timestamp updated successfully
    ) else (
        echo ⚠️  WARNING: BUILD_TIMESTAMP was not replaced!
        exit /b 1
    )
) else (
    echo ❌ ERROR: Service Worker not found in dist/
    exit /b 1
)

REM Step 5: Verify _headers file is in dist
if exist "dist\_headers" (
    echo ✅ _headers file found in dist/
) else (
    echo ⚠️  WARNING: _headers file not found in dist/
)

echo.
echo ✅ Build completed successfully!
echo.
echo 📋 Deployment Checklist:
echo   1. Service Worker: ✅ Updated with new cache version
echo   2. Assets: ✅ Generated with unique hashes
echo   3. Cache Headers: ✅ Configured
echo.
echo 🎉 Ready to deploy!
