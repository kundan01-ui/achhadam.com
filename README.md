# 🌾 ACHHADAM - Enterprise Digital Farming Platform

> **Production-Ready Agricultural Marketplace**
> Connecting Farmers, Buyers, and Service Providers through Technology

![Version](https://img.shields.io/badge/version-1.1.0-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React](https://img.shields.io/badge/react-18-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

---

## 📋 Overview

**ACHHADAM** is an enterprise-grade digital platform that revolutionizes agricultural commerce by:

✅ **Connecting Farmers & Buyers** directly for crop transactions  
✅ **Real-time Marketplace** with live pricing and inventory  
✅ **Firebase Integration** for real-time messaging and authentication  
✅ **Payment Processing** with Razorpay  
✅ **Location Services** with Google Maps  
✅ **Analytics Dashboard** for market insights  
✅ **Service Marketplace** - consultations, equipment rental  
✅ **Mobile Responsive** design  

Built with modern technologies: React, Node.js, MongoDB, Firebase, Redis, and WebSocket.

---

## 🎯 Key Features

### 🚜 Farmer Dashboard
- List crops with real-time pricing
- Inventory management
- Sales tracking and analytics
- Direct buyer communication
- Service offerings (equipment rental, consultations)
- Earnings report

### 🛒 Buyer Dashboard  
- Browse crops with advanced filters
- Real-time marketplace
- Bulk order management
- Seller profiles and ratings
- Order history and tracking
- Wishlist and saved searches

### 💼 Service Provider Features
- Offer consultations
- Equipment rental management
- Appointment scheduling
- Performance analytics
- Review management

### 🔧 Platform Features
- 🔐 **Enterprise Security** - JWT, OTP, rate limiting, helmet
- 📊 **API Documentation** - Swagger/OpenAPI
- 🐳 **Docker Support** - containerized deployment
- ⚡ **Redis Caching** - high-performance operations
- 🔄 **Real-time Updates** - WebSocket & Firebase
- 📝 **Structured Logging** - Winston logger
- 🌐 **Multi-language** - Hindi/English support
- 📱 **Mobile Responsive** - works on all devices

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first styling
- **React Router v7** - Client-side routing
- **Firebase SDK** - Real-time features
- **Lucide React** - Icon library
- **Socket.io Client** - Real-time messaging

### Backend
- **Node.js 18+** - Runtime
- **Express.js** - Web framework
- **MongoDB** with Mongoose - NoSQL database
- **Firebase Admin SDK** - Auth & real-time DB
- **Socket.io** - WebSocket communication
- **JWT** - Token authentication
- **Cloudinary** - Image management
- **Razorpay** - Payment gateway
- **Redis** - Caching layer
- **Helmet** - Security headers
- **Winston** - Logging
- **Swagger** - API documentation

### Infrastructure
- **Docker** - Containerization
- **Railway/Render** - Deployment platforms
- **Firebase Firestore** - Real-time database
- **MongoDB Atlas** - Managed MongoDB
- **Cloudinary** - Image CDN
- **Google Cloud** - Various APIs

---

## 📦 Project Structure

```
achhadam/
├── frontend/                      # React + TypeScript application
│   ├── src/
│   │   ├── pages/                # Page components (Landing, Dashboard, etc.)
│   │   ├── components/           # Reusable UI components
│   │   ├── services/             # API & Firebase services
│   │   ├── config/               # Configuration files
│   │   ├── translations/         # i18n language files
│   │   └── assets/               # Images and static files
│   ├── public/                   # Static assets
│   ├── index.html
│   └── package.json
│
├── backend/                       # Node.js Express server
│   ├── src/
│   │   ├── routes/               # API endpoints
│   │   ├── models/               # Mongoose schemas
│   │   ├── services/             # Business logic
│   │   ├── config/               # Configuration
│   │   ├── middleware/           # Custom middleware
│   │   └── utils/                # Helper functions
│   ├── server.js                 # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Firebase** account with Firestore enabled
- **Git**

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure environment variables:
# VITE_FIREBASE_API_KEY=your_firebase_api_key
# VITE_GOOGLE_MAPS_API_KEY=your_maps_key
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# Opens on http://localhost:5173
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables:
# NODE_ENV=development
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# FIREBASE_PROJECT_ID=your_firebase_project_id
# RAZORPAY_KEY_ID=your_razorpay_key
# RAZORPAY_KEY_SECRET=your_razorpay_secret
# CLOUDINARY_NAME=your_cloudinary_name
# CLOUDINARY_API_KEY=your_cloudinary_key
# CLOUDINARY_API_SECRET=your_cloudinary_secret

# Start development server
npm run dev

# Server runs on http://localhost:5000
```

---

## 🔗 API Endpoints

### Authentication
```
POST   /api/auth/register        - User registration
POST   /api/auth/login           - User login
POST   /api/auth/send-otp        - Send OTP via SMS/Email
POST   /api/auth/verify-otp      - Verify OTP
POST   /api/auth/refresh-token   - Refresh JWT token
```

### Crops/Marketplace
```
GET    /api/crops                - List all crops with filters
POST   /api/crops                - Create new crop listing
GET    /api/crops/:id            - Get crop details
PUT    /api/crops/:id            - Update crop listing
DELETE /api/crops/:id            - Delete crop listing
GET    /api/crops/search/:query  - Search crops
```

### Orders
```
POST   /api/orders               - Create new order
GET    /api/orders               - User's orders
GET    /api/orders/:id           - Order details
PUT    /api/orders/:id/status    - Update order status
GET    /api/orders/farmer/:id    - Farmer's received orders
```

### Payments
```
POST   /api/payments/create-order - Create Razorpay order
POST   /api/payments/verify       - Verify payment
GET    /api/payments/history      - Payment history
```

### Messages (Real-time via WebSocket)
```
Socket events for real-time messaging
```

### Analytics
```
GET    /api/analytics/dashboard   - Dashboard metrics
GET    /api/analytics/crops/:id   - Crop performance
GET    /api/analytics/trends      - Market trends
```

---

## 🔐 Environment Variables

### Frontend (.env.local)
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id

VITE_API_URL=http://localhost:5000/api
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key
```

### Backend (.env)
```env
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/achhadam

# JWT
JWT_SECRET=your_very_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=7d

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Cloudinary
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Redis
REDIS_URL=redis://localhost:6379

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

---

## � Database Schema

### Core MongoDB Collections

#### Users
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  phone: String,
  userType: "farmer" | "buyer" | "serviceProvider",
  profileImage: String,
  location: { lat: Number, lng: Number },
  address: String,
  rating: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### CropListings
```javascript
{
  _id: ObjectId,
  farmerId: ObjectId,
  cropName: String,
  category: String,
  price: Number,
  quantity: Number,
  unit: String,
  location: { lat: Number, lng: Number },
  images: [String],
  description: String,
  harvestDate: Date,
  status: "active" | "sold" | "inactive",
  createdAt: Date
}
```

#### Orders
```javascript
{
  _id: ObjectId,
  buyerId: ObjectId,
  farmerId: ObjectId,
  cropId: ObjectId,
  quantity: Number,
  totalPrice: Number,
  status: "pending" | "confirmed" | "shipped" | "delivered",
  paymentStatus: "pending" | "paid" | "failed",
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Deployment

### Docker Compose (Local Development)
```bash
docker-compose up -d
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

### Deploy to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Deploy to Render
```bash
# Push to GitHub main branch
git push origin main

# Render auto-deploys
# Configure environment variables in Render dashboard
```

---

## 📈 Performance Optimizations

- ✅ **Image Optimization** - Cloudinary with lazy loading
- ✅ **Code Splitting** - Vite chunking & tree shaking
- ✅ **Database Indexing** - MongoDB indexes on frequently queried fields
- ✅ **Caching** - Redis layer for session & data
- ✅ **API Pagination** - Large datasets paginated
- ✅ **Rate Limiting** - Express rate-limit middleware
- ✅ **Compression** - Gzip response compression
- ✅ **CDN Ready** - Static assets optimized for CDN

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push branch: `git push origin feature/amazing-feature`
4. Open Pull Request

---

## 🎯 Roadmap

- [ ] Mobile app (React Native/Flutter)
- [ ] AI-powered crop recommendations
- [ ] Blockchain supply chain tracking
- [ ] IoT sensor integration
- [ ] Video consultations
- [ ] Weather API integration
- [ ] Loan application system
- [ ] Inventory management module

---

## 📞 Support & Contact

- 📧 **Email:** support@achhadam.com
- 🐛 **Report Bugs:** GitHub Issues
- 💡 **Feature Requests:** Discussions
- 🌐 **Website:** achhadam.com

---

## 📄 License

This project is **proprietary and confidential**. All rights reserved.

---

## 👨‍💻 Team

Built with ❤️ by the ACHHADAM Team

---

**Last Updated:** December 2025  
**Current Version:** 1.1.0  
**Status:** Production Ready ✅
docker-compose up -d

# Access
# Frontend: http://localhost
# Backend: http://localhost:5000
# API Docs: http://localhost:5000/api-docs
```

### Manual Setup

```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev
```

---

## 📚 Environment Variables Setup

This project uses environment variables for secure configuration.

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```
# Server Configuration
PORT=10000
NODE_ENV=development

# Security
SESSION_SECRET=your-session-secret-change-in-production
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=24h

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:5174,https://your-frontend-domain.com

# Database Connections
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
POSTGRES_URI=postgresql://username:password@host:port/database?sslmode=require

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
# FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_yourkeyhere
RAZORPAY_KEY_SECRET=yoursecrethere

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
OTP_RATE_LIMIT_WINDOW_MS=60000
OTP_RATE_LIMIT_MAX_REQUESTS=10

# Cookie Settings
COOKIE_SECRET=your-cookie-secret-change-in-production
COOKIE_MAX_AGE=31536000000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```
# API Configuration
VITE_API_URL=http://localhost:10000

# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=rzp_test_yourkeyhere

# Google Configuration
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your-api-key

# Analytics Configuration
VITE_ENABLE_ANALYTICS=false

# Feature Flags
VITE_ENABLE_KYC=true
VITE_ENABLE_RAZORPAY=true
VITE_ENABLE_GOOGLE_AUTH=true
```

## Switching Between Development and Production

### Backend

1. In development:
   - Set `NODE_ENV=development`
   - Use local database URIs or development cloud instances

2. In production:
   - Set `NODE_ENV=production`
   - Use production database URIs
   - Set proper security settings (JWT_SECRET, SESSION_SECRET, etc.)
   - Update CORS_ORIGIN to include only production domains

### Frontend

1. In development:
   - Set `VITE_API_URL` to your local backend URL (e.g., http://localhost:10000)

2. In production:
   - Set `VITE_API_URL` to your production backend URL
   - Use production API keys for services like Firebase, Razorpay, etc.

## Client Deployment Instructions

When deploying for a client:

1. Create new `.env` files for both backend and frontend
2. Replace all API keys, database connection strings, and secrets with client's credentials
3. Update domain names in CORS settings to match client's domains
4. Deploy the application with the new environment variables

The application is designed to read all configuration from environment variables, so no code changes are required when switching between different environments or clients.



#   F o r c e   r e d e p l o y 
 
 