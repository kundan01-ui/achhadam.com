/**
 * ========================================
 * ACHHADAM - CENTRALIZED API CONFIGURATION
 * ========================================
 *
 * 🔧 FOR CLIENT SETUP:
 * Replace all API keys below with client's credentials
 * All services will automatically use new keys
 *
 * ⚠️ IMPORTANT:
 * After updating keys, also update .env file
 * Then restart the server
 *
 * ========================================
 */

module.exports = {

  // ========================================
  // CLOUDINARY - IMAGE STORAGE
  // ========================================
  cloudinary: {
    enabled: process.env.CLOUDINARY_ENABLED === 'true',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'dutlrmeod',
    apiKey: process.env.CLOUDINARY_API_KEY || '572864644421472',
    apiSecret: process.env.CLOUDINARY_API_SECRET || 'gb4dROwMA3IU0gkrjLj0bW1u_cM',

    // Client Setup Instructions:
    // 1. Create account at https://cloudinary.com
    // 2. Get credentials from Dashboard
    // 3. Update .env file:
    //    CLOUDINARY_CLOUD_NAME=client_cloud_name
    //    CLOUDINARY_API_KEY=client_api_key
    //    CLOUDINARY_API_SECRET=client_api_secret
    //    CLOUDINARY_ENABLED=true
  },

  // ========================================
  // RAZORPAY - PAYMENT GATEWAY
  // ========================================
  razorpay: {
    enabled: process.env.RAZORPAY_ENABLED === 'true',
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',

    // Client Setup Instructions:
    // 1. Create account at https://razorpay.com
    // 2. Generate API keys from Dashboard > Settings > API Keys
    // 3. Update .env file:
    //    RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
    //    RAZORPAY_KEY_SECRET=client_secret_key
    //    RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxx
    //    RAZORPAY_ENABLED=true
  },

  // ========================================
  // SMS SERVICE - MSG91 / TWILIO
  // ========================================
  sms: {
    provider: process.env.SMS_PROVIDER || 'msg91', // 'msg91' or 'twilio'

    // MSG91 Configuration
    msg91: {
      authKey: process.env.MSG91_AUTH_KEY || '',
      senderId: process.env.MSG91_SENDER_ID || 'ACHHDM',
      route: process.env.MSG91_ROUTE || '4',

      // Client Setup Instructions:
      // 1. Create account at https://msg91.com
      // 2. Get Auth Key from Dashboard
      // 3. Update .env file:
      //    SMS_PROVIDER=msg91
      //    MSG91_AUTH_KEY=client_auth_key
      //    MSG91_SENDER_ID=CLIENTID (max 6 chars)
    },

    // Twilio Configuration (Alternative)
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
      phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',

      // Client Setup Instructions:
      // 1. Create account at https://twilio.com
      // 2. Get credentials from Console
      // 3. Update .env file:
      //    SMS_PROVIDER=twilio
      //    TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
      //    TWILIO_AUTH_TOKEN=client_auth_token
      //    TWILIO_PHONE_NUMBER=+1234567890
    }
  },

  // ========================================
  // EMAIL SERVICE - SENDGRID / AWS SES
  // ========================================
  email: {
    provider: process.env.EMAIL_PROVIDER || 'sendgrid', // 'sendgrid' or 'ses'
    from: process.env.EMAIL_FROM || 'noreply@achhadam.com',

    // SendGrid Configuration
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || '',

      // Client Setup Instructions:
      // 1. Create account at https://sendgrid.com
      // 2. Generate API key from Settings > API Keys
      // 3. Update .env file:
      //    EMAIL_PROVIDER=sendgrid
      //    SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxx
      //    EMAIL_FROM=noreply@clientdomain.com
    },

    // AWS SES Configuration (Alternative)
    ses: {
      accessKeyId: process.env.AWS_SES_ACCESS_KEY || '',
      secretAccessKey: process.env.AWS_SES_SECRET_KEY || '',
      region: process.env.AWS_SES_REGION || 'ap-south-1',

      // Client Setup Instructions:
      // 1. Create AWS account and setup SES
      // 2. Generate access keys from IAM
      // 3. Update .env file:
      //    EMAIL_PROVIDER=ses
      //    AWS_SES_ACCESS_KEY=AKIA...
      //    AWS_SES_SECRET_KEY=client_secret_key
      //    AWS_SES_REGION=ap-south-1
    }
  },

  // ========================================
  // GOOGLE MAPS API
  // ========================================
  maps: {
    enabled: process.env.GOOGLE_MAPS_ENABLED === 'true',
    apiKey: process.env.GOOGLE_MAPS_API_KEY || '',

    // Client Setup Instructions:
    // 1. Go to https://console.cloud.google.com
    // 2. Enable Maps JavaScript API, Geocoding API, Places API
    // 3. Create API key with restrictions
    // 4. Update .env file:
    //    GOOGLE_MAPS_API_KEY=AIzaSyxxxxxxxxxxxxxxxxx
    //    GOOGLE_MAPS_ENABLED=true
  },

  // ========================================
  // WEATHER API
  // ========================================
  weather: {
    provider: process.env.WEATHER_PROVIDER || 'openweather', // 'openweather' or 'weatherapi'

    // OpenWeatherMap Configuration
    openweather: {
      apiKey: process.env.OPENWEATHER_API_KEY || '',

      // Client Setup Instructions:
      // 1. Create account at https://openweathermap.org
      // 2. Generate API key from Dashboard
      // 3. Update .env file:
      //    WEATHER_PROVIDER=openweather
      //    OPENWEATHER_API_KEY=client_api_key
    },

    // WeatherAPI.com Configuration (Alternative)
    weatherapi: {
      apiKey: process.env.WEATHER_API_KEY || '',

      // Client Setup Instructions:
      // 1. Create account at https://weatherapi.com
      // 2. Get free API key
      // 3. Update .env file:
      //    WEATHER_PROVIDER=weatherapi
      //    WEATHER_API_KEY=client_api_key
    }
  },

  // ========================================
  // FIREBASE - PUSH NOTIFICATIONS
  // ========================================
  firebase: {
    enabled: process.env.FIREBASE_ENABLED === 'true',
    projectId: process.env.FIREBASE_PROJECT_ID || 'digital-farming-platform',
    privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',

    // Client Setup Instructions:
    // 1. Create Firebase project at https://console.firebase.google.com
    // 2. Go to Project Settings > Service Accounts
    // 3. Generate new private key (downloads JSON file)
    // 4. Update .env file:
    //    FIREBASE_PROJECT_ID=client-project-id
    //    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
    //    FIREBASE_CLIENT_EMAIL=firebase-adminsdk@client-project.iam.gserviceaccount.com
    //    FIREBASE_ENABLED=true
  },

  // ========================================
  // OPENAI - AI FEATURES
  // ========================================
  openai: {
    enabled: process.env.OPENAI_ENABLED === 'true',
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',

    // Client Setup Instructions:
    // 1. Create account at https://platform.openai.com
    // 2. Generate API key from API Keys section
    // 3. Update .env file:
    //    OPENAI_API_KEY=sk-xxxxxxxxxxxxxxx
    //    OPENAI_MODEL=gpt-3.5-turbo
    //    OPENAI_ENABLED=true
  },

  // ========================================
  // AWS S3 - FILE STORAGE (ALTERNATIVE TO CLOUDINARY)
  // ========================================
  s3: {
    enabled: process.env.AWS_S3_ENABLED === 'true',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'ap-south-1',
    bucket: process.env.AWS_S3_BUCKET || '',

    // Client Setup Instructions:
    // 1. Create AWS account and S3 bucket
    // 2. Create IAM user with S3 permissions
    // 3. Update .env file:
    //    AWS_S3_ENABLED=true
    //    AWS_ACCESS_KEY_ID=AKIA...
    //    AWS_SECRET_ACCESS_KEY=client_secret_key
    //    AWS_REGION=ap-south-1
    //    AWS_S3_BUCKET=client-bucket-name
  },

  // ========================================
  // ANALYTICS - GOOGLE ANALYTICS / MIXPANEL
  // ========================================
  analytics: {
    googleAnalytics: {
      enabled: process.env.GA_ENABLED === 'true',
      trackingId: process.env.GA_TRACKING_ID || '',

      // Client Setup Instructions:
      // 1. Create property at https://analytics.google.com
      // 2. Get Tracking ID (G-XXXXXXXXXX)
      // 3. Update .env file:
      //    GA_TRACKING_ID=G-XXXXXXXXXX
      //    GA_ENABLED=true
    },

    mixpanel: {
      enabled: process.env.MIXPANEL_ENABLED === 'true',
      token: process.env.MIXPANEL_TOKEN || '',

      // Client Setup Instructions:
      // 1. Create project at https://mixpanel.com
      // 2. Get project token from Settings
      // 3. Update .env file:
      //    MIXPANEL_TOKEN=client_token
      //    MIXPANEL_ENABLED=true
    }
  },

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  /**
   * Check if all required API keys are configured
   */
  validateConfig() {
    const warnings = [];

    // Check critical services
    if (!this.cloudinary.enabled && !this.s3.enabled) {
      warnings.push('⚠️  No image storage configured (Cloudinary or S3)');
    }

    if (!this.razorpay.enabled) {
      warnings.push('⚠️  Payment gateway not configured (Razorpay)');
    }

    if (!this.email.sendgrid.apiKey && !this.email.ses.accessKeyId) {
      warnings.push('⚠️  No email service configured (SendGrid or SES)');
    }

    if (warnings.length > 0) {
      console.log('\n⚠️  CONFIGURATION WARNINGS:');
      warnings.forEach(w => console.log(w));
      console.log('\nℹ️  Update .env file with client API keys\n');
    } else {
      console.log('✅ All critical API services configured');
    }

    return warnings;
  },

  /**
   * Get configuration summary for debugging
   */
  getSummary() {
    return {
      cloudinary: this.cloudinary.enabled ? '✅ Enabled' : '❌ Disabled',
      razorpay: this.razorpay.enabled ? '✅ Enabled' : '❌ Disabled',
      sms: this.sms.provider,
      email: this.email.provider,
      maps: this.maps.enabled ? '✅ Enabled' : '❌ Disabled',
      weather: this.weather.provider,
      firebase: this.firebase.enabled ? '✅ Enabled' : '❌ Disabled',
      openai: this.openai.enabled ? '✅ Enabled' : '❌ Disabled',
      s3: this.s3.enabled ? '✅ Enabled' : '❌ Disabled'
    };
  }
};
