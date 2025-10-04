# 🔥 Firebase Services Documentation

Firebase ke saare features integrate kar diye gaye hain. Yahan complete guide hai:

## 📦 Services Created

### 1. **Firebase Firestore Service** (`firebaseCropService.ts`)
**Real-time crop data sync with Firestore**

#### Features:
- ✅ Add/Update/Delete crops in Firestore
- ✅ Real-time listeners for live updates
- ✅ Search by crop type
- ✅ Batch operations
- ✅ Automatic timestamps
- ✅ Offline persistence (already enabled in firebase.ts)

#### Usage:
```typescript
import {
  addCropToFirestore,
  subscribeFarmerCrops,
  updateCropStatus
} from './services/firebaseCropService';

// Add crop
const result = await addCropToFirestore({
  name: 'Wheat',
  type: 'grain',
  farmerId: 'farmer123',
  price: 2500
  // ... other fields
});

// Real-time listener
const unsubscribe = subscribeFarmerCrops('farmer123', (crops) => {
  console.log('Live crops:', crops);
});

// Cleanup
unsubscribe();
```

---

### 2. **Firebase Storage Service** (`firebaseStorageService.ts`)
**Image/Video/Document upload to Firebase Storage**

#### Features:
- ✅ Single & multiple file uploads
- ✅ Upload progress tracking
- ✅ Image compression
- ✅ File metadata management
- ✅ Delete files/folders
- ✅ Get download URLs

#### Usage:
```typescript
import {
  uploadImageToFirebase,
  uploadMultipleImagesToFirebase,
  compressImage
} from './services/firebaseStorageService';

// Upload single image with progress
const result = await uploadImageToFirebase(
  file,
  cropId,
  farmerId,
  { customMetadata: { quality: 'high' } },
  (progress) => console.log(`${progress}%`)
);

// Upload multiple images
const multiResult = await uploadMultipleImagesToFirebase(
  files,
  cropId,
  farmerId
);

console.log('URLs:', multiResult.downloadURLs);
```

---

### 3. **Hybrid Service** (`firebaseMongoService.ts`)
**Firebase Storage + MongoDB Integration**

#### Architecture:
```
1. Upload files → Firebase Storage
2. Get download URLs
3. Save URLs → MongoDB
```

#### Features:
- ✅ Upload images/videos/docs to Firebase
- ✅ Save metadata + URLs to MongoDB
- ✅ Combined progress tracking
- ✅ Automatic rollback on failure
- ✅ Delete files + database entries

#### Usage:
```typescript
import {
  uploadCropWithMedia,
  loadCropsWithMedia
} from './services/firebaseMongoService';

// Upload crop with media
const result = await uploadCropWithMedia(
  cropData,
  imageFiles,
  videoFiles,
  documentFiles,
  (progress) => console.log(`Upload: ${progress}%`)
);

// Load crops (with Firebase URLs)
const { data: crops } = await loadCropsWithMedia(farmerId);
```

---

### 4. **Firebase Cloud Messaging** (`firebaseMessagingService.ts`)
**Push Notifications Service**

#### Features:
- ✅ Request notification permission
- ✅ Get FCM token
- ✅ Foreground message listener
- ✅ Topic subscription (broadcast)
- ✅ Send notifications via backend

#### Usage:
```typescript
import {
  initializeFCM,
  onForegroundMessage,
  subscribeToTopic
} from './services/firebaseMessagingService';

// Initialize FCM
const { token } = await initializeFCM();

// Listen for messages
onForegroundMessage((payload) => {
  console.log('New notification:', payload);
});

// Subscribe to topics
await subscribeToTopic('crop_updates');
```

#### Service Worker Required:
Create `public/firebase-messaging-sw.js`:
```javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDIr9HygDcTillF47oYfi1xIEozr9l8mBA",
  projectId: "digital-farming-platform",
  messagingSenderId: "1024746152320",
  appId: "1:1024746152320:web:67799730096fd80fc32165"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);
  const { title, body, icon } = payload.notification;

  self.registration.showNotification(title, {
    body,
    icon: icon || '/logo.png'
  });
});
```

---

### 5. **Firebase Analytics** (`firebaseAnalyticsService.ts`)
**User Behavior & Event Tracking**

#### Features:
- ✅ Track user login/signup
- ✅ Track crop uploads/views
- ✅ Track orders & payments
- ✅ Track searches & filters
- ✅ Track errors
- ✅ Custom events
- ✅ User properties

#### Usage:
```typescript
import {
  initializeAnalytics,
  trackCropUpload,
  trackOrderCreated,
  trackPageView
} from './services/firebaseAnalyticsService';

// Initialize
initializeAnalytics('farmer123', {
  userType: 'farmer',
  location: 'Punjab',
  verified: 'true'
});

// Track events
trackCropUpload({
  cropId: 'crop123',
  cropType: 'grain',
  cropName: 'Wheat',
  price: 2500,
  quantity: 100,
  imagesCount: 5
});

trackPageView('/dashboard', 'Farmer Dashboard');
```

---

## 🚀 Complete Integration Flow

### Example: Upload Crop with Images

```typescript
import { uploadCropWithMedia } from './services/firebaseMongoService';
import { trackCropUpload } from './services/firebaseAnalyticsService';
import { sendNotification } from './services/firebaseMessagingService';

async function handleCropUpload(cropData, imageFiles) {
  // 1. Upload to Firebase Storage + MongoDB
  const result = await uploadCropWithMedia(
    cropData,
    imageFiles,
    null, // videos
    null, // documents
    (progress) => {
      console.log(`Upload progress: ${progress}%`);
    }
  );

  if (result.success) {
    // 2. Track analytics
    trackCropUpload({
      cropId: result.cropId,
      cropType: cropData.type,
      cropName: cropData.name,
      price: cropData.price,
      quantity: cropData.quantity,
      imagesCount: imageFiles.length
    });

    // 3. Send notification to buyers
    await sendNotification('all_buyers', {
      title: 'New Crop Available',
      body: `${cropData.name} - ₹${cropData.price}/${cropData.unit}`,
      data: {
        type: 'NEW_CROP',
        cropId: result.cropId
      }
    });

    console.log('✅ Crop uploaded successfully!');
  }
}
```

---

## 🔧 Environment Variables Required

Add to `.env`:

```env
# Firebase Config (already set)
VITE_FIREBASE_API_KEY=AIzaSyDIr9HygDcTillF47oYfi1xIEozr9l8mBA
VITE_FIREBASE_AUTH_DOMAIN=digital-farming-platform.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=digital-farming-platform
VITE_FIREBASE_STORAGE_BUCKET=digital-farming-platform.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1024746152320
VITE_FIREBASE_APP_ID=1:1024746152320:web:67799730096fd80fc32165
VITE_FIREBASE_MEASUREMENT_ID=G-BJK3TJ7M9F

# VAPID Key for FCM (get from Firebase Console)
VITE_FIREBASE_VAPID_KEY=YOUR_VAPID_KEY
```

---

## 📊 Firebase Console Setup

### 1. Enable Services:
- ✅ **Authentication** → Phone, Google
- ✅ **Firestore Database** → Production mode
- ✅ **Storage** → Production mode
- ✅ **Cloud Messaging** → Get VAPID key
- ✅ **Analytics** → Enable

### 2. Firestore Security Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /crops/{cropId} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Authenticated write
    }
  }
}
```

### 3. Storage Security Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /crops/{farmerId}/{cropId}/{allPaths=**} {
      allow read: if true; // Public read
      allow write: if request.auth != null; // Authenticated write
    }
  }
}
```

---

## 🎯 Key Benefits

1. **Real-time Sync** - Firestore listeners for live updates
2. **Scalable Storage** - Firebase Storage with CDN
3. **Push Notifications** - FCM for instant alerts
4. **Analytics** - Track user behavior
5. **Offline Support** - Works without internet
6. **Hybrid Architecture** - Firebase Storage + MongoDB for best of both worlds

---

## 📝 Migration from Cloudinary

### Before:
```typescript
// Old Cloudinary code (commented out in databaseService.ts)
uploadImagesToCloud(images); // ❌ Deprecated
```

### After:
```typescript
// New Firebase Storage
uploadCropWithMedia(cropData, images); // ✅ Recommended
```

---

## 🔔 Notification Types

```typescript
enum NotificationType {
  NEW_ORDER = 'NEW_ORDER',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  PRICE_UPDATE = 'PRICE_UPDATE',
  CROP_APPROVED = 'CROP_APPROVED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  WEATHER_ALERT = 'WEATHER_ALERT'
}
```

---

## 🎨 UI Integration Example

```typescript
// In your component
import { useState } from 'react';
import { uploadCropWithMedia } from './services/firebaseMongoService';

function CropUploadForm() {
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (cropData, images) => {
    const result = await uploadCropWithMedia(
      cropData,
      images,
      null,
      null,
      setProgress // Progress callback
    );

    if (result.success) {
      alert('Crop uploaded successfully!');
    }
  };

  return (
    <div>
      {/* Your form */}
      {progress > 0 && (
        <div>Upload Progress: {progress}%</div>
      )}
    </div>
  );
}
```

---

## 🛠️ Troubleshooting

### Issue: FCM not working
**Solution:** Create `firebase-messaging-sw.js` in `public/` folder

### Issue: Analytics not tracking
**Solution:** Check if Analytics is enabled in Firebase Console

### Issue: Storage upload fails
**Solution:** Check Storage rules and authentication

### Issue: Firestore permission denied
**Solution:** Update Firestore security rules

---

## 📚 Additional Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Analytics](https://firebase.google.com/docs/analytics)

---

**✅ All Firebase services are ready to use!**

Koi aur feature chahiye to bolo! 🚀
