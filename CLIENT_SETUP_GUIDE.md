# 🚀 ACHHADAM - CLIENT SETUP GUIDE

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Setup (5 Minutes)](#quick-setup)
3. [API Keys Setup](#api-keys-setup)
4. [Testing](#testing)
5. [Production Deployment](#production-deployment)
6. [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before starting, ensure you have:
- ✅ Node.js v16 or higher installed
- ✅ MongoDB Atlas account (or local MongoDB)
- ✅ Git installed
- ✅ Code editor (VS Code recommended)

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Clone Repository
```bash
git clone https://github.com/AIconsciousness/acchadam1.git
cd acchadam1
```

### Step 2: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Setup Environment Variables
```bash
# Go to backend folder
cd backend

# Copy example file
copy .env.example .env

# Edit .env file with your API keys (see next section)
```

### Step 4: Start Development Servers
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

✅ **Done!** Backend running on http://localhost:5000, Frontend on http://localhost:5173

---

## 🔑 API Keys Setup

### 🎯 **REQUIRED (Critical for Platform)**

#### 1. MongoDB Database
**Why:** Stores all platform data (users, crops, orders)

**Setup:**
1. Go to https://cloud.mongodb.com
2. Create free cluster (M0 - Free tier)
3. Create database user (username + password)
4. Get connection string
5. Update .env:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/achhadam?retryWrites=true&w=majority
```

#### 2. JWT Secret Keys
**Why:** Secure user authentication tokens

**Setup:**
```bash
# Generate secure random strings
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update .env:
```env
JWT_SECRET=<generated_string_1>
JWT_REFRESH_SECRET=<generated_string_2>
SESSION_SECRET=<generated_string_3>
```

---

### 🟢 **HIGH PRIORITY (Needed for Core Features)**

#### 3. Cloudinary (Image Storage)
**Why:** Fast image loading, CDN delivery, auto-optimization
**Cost:** FREE (25GB storage, 25GB bandwidth/month)

**Setup:**
1. Sign up: https://cloudinary.com
2. Go to Dashboard
3. Copy credentials
4. Update .env:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_ENABLED=true
```

**Alternative:** Set `CLOUDINARY_ENABLED=false` to use MongoDB (slower but works)

#### 4. Razorpay (Payment Gateway)
**Why:** Accept payments from buyers
**Cost:** 2% per transaction (no setup fee)

**Setup:**
1. Sign up: https://razorpay.com
2. Complete KYC
3. Dashboard > Settings > API Keys > Generate Test Keys
4. Update .env:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxx
RAZORPAY_ENABLED=true
```

**Note:** Use test keys for development, live keys for production

#### 5. SMS Service (For OTP)
**Why:** Login verification, order notifications
**Cost:** ₹0.25/SMS (MSG91) or ₹0.65/SMS (Twilio)

**Option A: MSG91 (Recommended for India)**
1. Sign up: https://msg91.com
2. Get Auth Key from Dashboard
3. Update .env:
```env
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your_auth_key
MSG91_SENDER_ID=ACHHDM
```

**Option B: Twilio (International)**
1. Sign up: https://twilio.com
2. Get credentials from Console
3. Update .env:
```env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### 6. SendGrid (Email Service)
**Why:** Send order confirmations, password reset emails
**Cost:** FREE (100 emails/day)

**Setup:**
1. Sign up: https://sendgrid.com
2. Settings > API Keys > Create API Key
3. Update .env:
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
```

---

### 🟡 **MEDIUM PRIORITY (Enhance User Experience)**

#### 7. Google Maps API
**Why:** Location search, delivery tracking, nearby farmers
**Cost:** $200 free credit/month

**Setup:**
1. Go to: https://console.cloud.google.com
2. Create project > Enable APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API
3. Create API key (with HTTP referrer restrictions)
4. Update .env:
```env
GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxxxxxx
GOOGLE_MAPS_ENABLED=true
```

#### 8. Weather API
**Why:** Crop advisory based on weather conditions
**Cost:** FREE (1000 calls/day - OpenWeatherMap)

**Setup:**
1. Sign up: https://openweathermap.org
2. Get API key from Dashboard
3. Update .env:
```env
WEATHER_PROVIDER=openweather
OPENWEATHER_API_KEY=your_api_key
```

#### 9. Firebase (Push Notifications)
**Why:** Order updates, new crop alerts
**Cost:** FREE (unlimited)

**Setup:**
1. Create project: https://console.firebase.google.com
2. Project Settings > Service Accounts > Generate New Private Key
3. Download JSON file, extract:
   - projectId
   - private_key
   - client_email
4. Update .env:
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_ENABLED=true
```

---

### 🔵 **OPTIONAL (Advanced Features)**

#### 10. OpenAI (AI Chatbot)
**Why:** AI-powered crop advisory, farmer queries
**Cost:** $0.002 per 1K tokens

**Setup:**
1. Sign up: https://platform.openai.com
2. Create API key
3. Update .env:
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_ENABLED=true
```

#### 11. Google Analytics
**Why:** User behavior tracking, conversion rates
**Cost:** FREE

**Setup:**
1. Create property: https://analytics.google.com
2. Get Tracking ID (G-XXXXXXXXXX)
3. Update .env:
```env
GA_TRACKING_ID=G-XXXXXXXXXX
GA_ENABLED=true
```

---

## 🧪 Testing

### Test Backend API
```bash
cd backend
npm start

# Should see:
# ✅ MongoDB connected successfully!
# ✅ Cloudinary enabled - Images will be uploaded to cloud storage
# 🚀 ACHHADAM Backend Server running on port 5000
```

### Test Frontend
```bash
cd frontend
npm run dev

# Open: http://localhost:5173
```

### Test API Configuration
```bash
# In server.js startup logs, verify:
✅ MongoDB connected successfully!
✅ Cloudinary enabled (if configured)
✅ All critical API services configured
```

---

## 🌐 Production Deployment

### Render.com (Recommended - FREE)

#### Backend Deployment
1. Push code to GitHub
2. Go to https://render.com
3. New > Web Service
4. Connect GitHub repository
5. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Add all .env variables from dashboard
6. Deploy

#### Frontend Deployment
1. New > Static Site
2. Configure:
   - **Build Command:** `cd frontend && npm run build`
   - **Publish Directory:** `frontend/dist`
3. Deploy

#### Add Environment Variables on Render:
Go to Dashboard > Environment > Add all keys from `.env.example`

---

## 🐛 Troubleshooting

### Issue: "MongoDB connection failed"
**Solution:** Check MONGODB_URI in .env, ensure IP whitelist in MongoDB Atlas (0.0.0.0/0 for all IPs)

### Issue: "Cloudinary upload failed"
**Solution:**
1. Check API credentials in .env
2. Set `CLOUDINARY_ENABLED=false` to use MongoDB fallback
3. Verify logs show "✅ Cloudinary enabled"

### Issue: "Payment not working"
**Solution:**
1. Use test keys for development
2. Verify `RAZORPAY_ENABLED=true`
3. Check Razorpay dashboard for webhook configuration

### Issue: "SMS not sending"
**Solution:**
1. Verify SMS provider credentials
2. Check MSG91/Twilio dashboard for errors
3. Ensure sufficient balance

---

## 📞 Support

**For Technical Issues:**
- Check logs in `backend/logs/` folder
- Enable `DEBUG_MODE=true` in .env
- Review API configuration using: `apiConfig.getSummary()`

**For API Key Issues:**
- Each service has setup instructions in `.env.example`
- All keys are centralized in `backend/src/config/apiConfig.js`
- Test each service independently

---

## 🎯 Minimum Viable Product (MVP)

**To launch platform, you MUST have:**
- ✅ MongoDB (database)
- ✅ JWT Secrets (authentication)
- ✅ Cloudinary OR MongoDB images (storage)
- ✅ Razorpay (payments)
- ✅ MSG91/Twilio (OTP)
- ✅ SendGrid (emails)

**Everything else is optional and can be added later!**

---

## 📊 Estimated Costs

### Minimal Setup (₹2,000-3,000/month)
- MongoDB Atlas: FREE (M0 tier)
- Cloudinary: FREE (25GB)
- Razorpay: 2% per transaction
- MSG91: ₹500 (2000 SMS)
- SendGrid: FREE (100 emails/day)
- Render Hosting: FREE

### Standard Setup (₹8,000-12,000/month)
- MongoDB Atlas: ₹1,500 (M10 cluster)
- Cloudinary Pro: ₹1,500
- Razorpay: 2% per transaction
- Twilio SMS: ₹2,000
- SendGrid: ₹800
- Google Maps: FREE (with credit)
- Render Pro: $7/month = ₹580

---

## ✅ Checklist

Before going live:
- [ ] All environment variables configured
- [ ] MongoDB connected successfully
- [ ] Payment gateway tested (test mode)
- [ ] SMS OTP working
- [ ] Email notifications working
- [ ] Images uploading (Cloudinary or MongoDB)
- [ ] Frontend connected to backend
- [ ] SSL certificate configured (HTTPS)
- [ ] CORS configured with production domain
- [ ] Backup strategy in place

**Good luck with your deployment! 🚀**
