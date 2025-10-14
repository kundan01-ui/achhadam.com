# 🚀 Firebase Firestore Setup - Quick Start Guide

## ❌ Current Error:
```
GET https://firestore.googleapis.com/...Listen... 400 (Bad Request)
WebChannelConnection RPC 'Listen' stream transport errored
```

## 🎯 Quick Fix - Choose ONE Method:

---

## ✅ METHOD 1: Automated CLI Setup (RECOMMENDED - 2 Minutes)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```
This will open browser for authentication.

### Step 3: Deploy Firestore Configuration
```bash
# Deploy indexes and rules together
firebase deploy --only firestore

# OR deploy separately:
firebase deploy --only firestore:indexes
firebase deploy --only firestore:rules
```

### Step 4: Wait for Indexes to Build
- Go to Firebase Console: https://console.firebase.google.com/
- Select project: **digital-farming-platform**
- Left sidebar → **Firestore Database** → **Indexes** tab
- Wait until all 3 indexes show **"Enabled"** status (5-10 minutes)
- Status will change from "Building" → "Enabled"

### Step 5: Test
```bash
# Clear browser cache and test
1. Press Ctrl + Shift + R (hard refresh)
2. Login as Buyer
3. Click message icon on any crop
4. Send test message
5. Check browser console - should see "✅ Message sent successfully"
```

---

## ✅ METHOD 2: Manual Firebase Console Setup (5-10 Minutes)

If CLI doesn't work, follow manual setup:

### Step 1: Go to Firebase Console
1. Open: https://console.firebase.google.com/
2. Select project: **digital-farming-platform**
3. Left sidebar → **Firestore Database**

### Step 2: Create Indexes

Click **Indexes** tab → Click **"+ CREATE INDEX"** for each:

#### Index 1: Conversations by User
```
Collection ID: conversations
Fields:
  - participants → ARRAY
  - lastMessageTime → DESCENDING
Query Scope: Collection
```

#### Index 2: Messages by Conversation
```
Collection ID: messages
Fields:
  - conversationId → ASCENDING
  - timestamp → ASCENDING
Query Scope: Collection
```

#### Index 3: Unread Messages
```
Collection ID: messages
Fields:
  - conversationId → ASCENDING
  - receiverId → ASCENDING
  - read → ASCENDING
Query Scope: Collection
```

### Step 3: Update Firestore Rules

Click **Rules** tab → Replace ALL rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

Click **"PUBLISH"** to save!

### Step 4: Wait & Test
Wait 5-10 minutes for indexes to build, then test messaging.

---

## 📊 What Gets Deployed:

### Files Created:
- ✅ `firestore.rules` - Security rules allowing read/write
- ✅ `firestore.indexes.json` - 3 composite indexes
- ✅ `firebase.json` - Firebase project configuration
- ✅ `.firebaserc` - Project ID configuration

### Indexes Created:
1. **Conversations Index** - Enables fetching user conversations sorted by time
2. **Messages Index** - Enables fetching messages in conversation
3. **Unread Messages Index** - Enables querying unread messages

---

## 🔧 Troubleshooting

### Error: "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### Error: "Permission denied"
```bash
firebase login --reauth
```

### Error: "Project not found"
Check `.firebaserc` file has correct project ID: `digital-farming-platform`

### Indexes still building?
- Wait 5-10 minutes
- Check status in Firebase Console → Firestore → Indexes
- Must show "Enabled" before testing

### Still getting 400 errors?
1. Clear browser cache (Ctrl + Shift + Delete)
2. Hard refresh page (Ctrl + Shift + R)
3. Check browser console for specific errors
4. Verify Firebase config in `frontend/src/config/firebase.ts`

---

## ✅ Success Verification

After setup completes:

### Buyer Side:
1. Login as Buyer
2. Go to Products/Marketplace
3. Click message icon on any crop
4. Send message: "What is the price?"
5. Console should show: `✅ Message sent successfully`

### Farmer Side:
1. Login as Farmer (different browser/incognito)
2. Click "Buyer" dropdown → "Buyer Messages"
3. Should see:
   - Buyer name
   - Crop name
   - Message content
   - Timestamp
   - Unread badge

---

## 📱 Expected Result

When working correctly:
- ✅ No 400 errors in console
- ✅ Messages appear instantly
- ✅ Unread counts update in real-time
- ✅ Both buyer and farmer can chat
- ✅ Messages persist across page refreshes
- ✅ Crop information shows in chat

---

## 🔗 Useful Commands

```bash
# Check Firebase project
firebase projects:list

# Check current project
firebase use

# View Firestore indexes
firebase firestore:indexes

# Deploy only rules
firebase deploy --only firestore:rules

# Deploy only indexes
firebase deploy --only firestore:indexes

# Deploy everything
firebase deploy --only firestore
```

---

## 📞 Support

If issues persist after setup:
1. Check FIRESTORE_SETUP_COMPLETE.md for detailed troubleshooting
2. Verify Firebase Console shows indexes as "Enabled"
3. Check browser console for specific error messages
4. Ensure authentication is enabled in Firebase Console

---

**⚠️ CRITICAL:**
- Method 1 (CLI) is faster and less error-prone
- Indexes take 5-10 minutes to build after deployment
- Must wait for "Enabled" status before testing
- Hard refresh browser after setup (Ctrl + Shift + R)
