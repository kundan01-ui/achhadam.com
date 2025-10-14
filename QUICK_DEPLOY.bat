@echo off
cls
echo ========================================
echo    FIREBASE AUTO DEPLOY - ONE CLICK
echo ========================================
echo.
echo This script will:
echo 1. Login to Firebase (opens browser)
echo 2. Deploy Firestore indexes and rules
echo 3. Show deployment status
echo.
echo ========================================
echo.

:login
echo Step 1: Firebase Login...
echo Browser will open. Please login with your Google account.
echo.
pause
firebase login
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Login failed! Trying again...
    echo.
    goto login
)

echo.
echo ========================================
echo Login Successful!
echo ========================================
echo.

:deploy
echo Step 2: Deploying Firestore Configuration...
echo.
firebase deploy --only firestore
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Deployment failed! Check errors above.
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo    DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Next Steps:
echo 1. Go to: https://console.firebase.google.com/
echo 2. Select project: digital-farming-platform
echo 3. Click: Firestore Database - Indexes tab
echo 4. Wait 5-10 minutes until all indexes show "Enabled"
echo.
echo After indexes are enabled:
echo - Clear browser cache (Ctrl+Shift+R)
echo - Test buyer-farmer messaging
echo - Check browser console for errors
echo.
echo ========================================
echo.
pause
