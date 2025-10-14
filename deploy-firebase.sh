#!/bin/bash

echo "========================================"
echo "Firebase Firestore Deployment Script"
echo "========================================"
echo ""

echo "Step 1: Checking Firebase CLI..."
if ! command -v firebase &> /dev/null
then
    echo "ERROR: Firebase CLI not found!"
    echo "Installing Firebase CLI..."
    npm install -g firebase-tools
fi
firebase --version
echo ""

echo "Step 2: Firebase Login Required..."
echo "This will open a browser window for authentication."
echo ""
read -p "Press Enter to continue..."
firebase login
echo ""

echo "Step 3: Deploying Firestore Configuration..."
echo "This will deploy indexes and security rules."
echo ""
firebase deploy --only firestore
echo ""

echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo ""
echo "IMPORTANT:"
echo "1. Go to Firebase Console: https://console.firebase.google.com/"
echo "2. Select project: digital-farming-platform"
echo "3. Go to Firestore Database -> Indexes tab"
echo "4. Wait 5-10 minutes for indexes to show 'Enabled' status"
echo "5. Then test the messaging system"
echo ""
read -p "Press Enter to exit..."
