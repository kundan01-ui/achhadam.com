# Achhadam - Digital Farming Platform

## Environment Variables Setup

This project uses environment variables for configuration to make it easy to deploy in different environments and to keep sensitive information secure. When transitioning from development to production or when deploying for a client, you'll need to update these environment variables.

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


