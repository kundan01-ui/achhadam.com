const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 10000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs (increased for development)
});

// OTP specific rate limiting (more lenient)
const otpLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 OTP requests per minute
  message: {
    error: 'Too many OTP requests. Please wait 1 minute before trying again.',
    retryAfter: 60
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || [
    'http://localhost:5173', 
    'http://localhost:5174', 
    'https://achhadam-frontend.onrender.com',
    'https://achhadamf.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(limiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware for OTP storage
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 10 * 60 * 1000 // 10 minutes
  }
}));

// Firebase Admin Initialization
// आपको अपना Firebase service account key यहाँ add करना होगा
const serviceAccount = {
  // Firebase service account key object यहाँ paste करें
  // या process.env.FIREBASE_SERVICE_ACCOUNT_KEY का उपयोग करें
  type: "service_account",
  project_id: "digital-farming-platform",
  // Add your service account key here
};

try {
  // For now, we'll use application default credentials
  // In production, add your service account key
  admin.initializeApp({
    projectId: "digital-farming-platform"
  });
  console.log('✅ Firebase Admin initialized successfully!');
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  console.log('📝 Please add your Firebase service account key to server.js');
}

// Database Connections
let mongoConnection = null;
let postgresConnection = null;

// MongoDB Connection
async function connectMongoDB() {
  try {
    const mongoURI = 'mongodb+srv://kamleshthink:Kamlesh%40%232005@cluster0.u1vgt.mongodb.net/krishi?retryWrites=true&w=majority&appName=Cluster0';
    mongoConnection = await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

// PostgreSQL Connection
async function connectPostgreSQL() {
  try {
    const postgresURI = 'postgresql://neondb_owner:npg_Ozpa3sFKwS0d@ep-jolly-mode-a156f3rx-pooler.ap-southeast-1.aws.neon.tech/krishi1?sslmode=require&channel_binding=require';
    postgresConnection = new Pool({
      connectionString: postgresURI,
      ssl: { rejectUnauthorized: false }
    });
    
    // Test connection
    const client = await postgresConnection.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ PostgreSQL (Neon) connected successfully!');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
  }
}

// User Schema (MongoDB)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { 
    type: String, 
    required: true, 
    enum: ['farmer', 'buyer', 'transporter'] 
  },
  email: String,
  farmName: String,
  farmSize: Number,
  farmSizeUnit: String,
  village: String,
  district: String,
  state: String,
  mainCrops: [String],
  experience: String,
  companyName: String,
  vehicleTypes: [String],
  serviceAreas: [String],
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// OTP Service
class FirebaseOTPService {
  constructor() {
    this.otpStore = new Map(); // Store session data
    this.otpExpiry = 5 * 60 * 1000; // 5 minutes
    this.maxAttempts = 3;
  }

  // Generate custom OTP for verification (Firebase handles SMS sending)
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Store OTP session data
  storeOTPSession(phone, sessionData) {
    const otpData = {
      ...sessionData,
      createdAt: Date.now(),
      attempts: 0,
      verified: false
    };
    
    this.otpStore.set(phone, otpData);
    
    // Auto-cleanup after expiry
    setTimeout(() => {
      this.otpStore.delete(phone);
    }, this.otpExpiry);
    
    return otpData;
  }

  // Verify OTP using Firebase
  async verifyOTP(phone, inputOTP) {
    const otpData = this.otpStore.get(phone);
    
    if (!otpData) {
      return { success: false, message: 'OTP session expired or not found' };
    }
    
    if (Date.now() - otpData.createdAt > this.otpExpiry) {
      this.otpStore.delete(phone);
      return { success: false, message: 'OTP session has expired' };
    }
    
    if (otpData.attempts >= this.maxAttempts) {
      this.otpStore.delete(phone);
      return { success: false, message: 'Maximum attempts exceeded' };
    }
    
    otpData.attempts++;
    
    try {
      // Verify OTP with Firebase
      const result = await otpData.confirmationResult.confirm(inputOTP);
      
      if (result.user) {
        otpData.verified = true;
        this.otpStore.delete(phone);
        return { 
          success: true, 
          message: 'OTP verified successfully',
          user: result.user
        };
      } else {
        return { success: false, message: 'Invalid OTP' };
      }
    } catch (error) {
      console.error('Firebase OTP verification failed:', error);
      return { 
        success: false, 
        message: error.message || 'Invalid OTP' 
      };
    }
  }

  // Send OTP using Firebase (this will be called from frontend)
  async sendOTP(phone) {
    try {
      // This method will be called from frontend
      // Backend just stores the session data
      console.log(`📱 Firebase OTP request for ${phone}`);
      
      return {
        success: true,
        message: 'OTP request processed',
        provider: 'Firebase Authentication'
      };
    } catch (error) {
      console.error('Firebase OTP request failed:', error);
      return {
        success: false,
        message: 'Failed to process OTP request',
        error: error.message
      };
    }
  }

  // Store Firebase confirmation result
  async storeConfirmationResult(phone, confirmationResult) {
    try {
      const sessionData = {
        confirmationResult: confirmationResult,
        phone: phone
      };
      
      this.storeOTPSession(phone, sessionData);
      
      return {
        success: true,
        message: 'OTP session stored successfully'
      };
    } catch (error) {
      console.error('Store confirmation result failed:', error);
      return {
        success: false,
        message: 'Failed to store OTP session',
        error: error.message
      };
    }
  }

  async resendOTP(phone) {
    try {
      const existingOTP = this.otpStore.get(phone);
      if (existingOTP) {
        const timeSinceLastOTP = Date.now() - existingOTP.createdAt;
        if (timeSinceLastOTP < 60000) { // 1 minute cooldown
          const remainingTime = Math.ceil((60000 - timeSinceLastOTP) / 1000);
          return {
            success: false,
            message: `Please wait ${remainingTime} seconds before requesting a new OTP`
          };
        }
      }
      
      const newOTP = this.generateOTP();
      this.storeOTP(phone, newOTP);
      const smsResult = await this.sendOTP(phone, newOTP);
      
      if (smsResult.success) {
        return {
          success: true,
          message: 'New OTP sent successfully',
          otp: newOTP // Remove this in production
        };
      } else {
        return smsResult;
      }
    } catch (error) {
      console.error('Resend OTP failed:', error);
      return {
        success: false,
        message: 'Failed to resend OTP',
        error: error.message
      };
    }
  }
}

// Initialize OTP Service
const otpService = new FirebaseOTPService();

// Health Check Endpoint
app.get('/health', async (req, res) => {
  try {
    const mongoStatus = mongoConnection ? 'connected' : 'disconnected';
    const postgresStatus = postgresConnection ? 'connected' : 'disconnected';
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      databases: {
        mongodb: mongoStatus,
        postgresql: postgresStatus
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ACHHADAM Backend API is running!',
    version: '1.0.0',
    databases: {
      mongodb: mongoConnection ? 'Connected' : 'Disconnected',
      postgresql: postgresConnection ? 'Connected' : 'Disconnected'
    },
    endpoints: {
      health: '/health',
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me'
      },
      users: 'GET /api/users'
    }
  });
});

// OTP Routes
app.post('/api/auth/send-otp', otpLimiter, async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }
    
    const { confirmationResult } = req.body;
    
    // Store Firebase confirmation result for verification
    if (confirmationResult) {
      const storeResult = await otpService.storeConfirmationResult(phone, confirmationResult);
      
      if (storeResult.success) {
        res.json({
          success: true,
          message: 'OTP session stored successfully',
          phone: phone,
          provider: 'Firebase Authentication'
        });
      } else {
        res.status(500).json({
          success: false,
          message: storeResult.message || 'Failed to store OTP session',
          error: storeResult.error
        });
      }
    } else {
      // Fallback to mock OTP for development
      const otp = otpService.generateOTP();
      const smsResult = await otpService.sendOTP(phone);
      
      if (smsResult.success) {
        res.json({
          success: true,
          message: 'OTP sent successfully (Mock)',
          phone: phone,
          otp: process.env.NODE_ENV === 'development' ? otp : undefined,
          provider: 'Mock SMS Service'
        });
      } else {
        res.status(500).json({
          success: false,
          message: smsResult.message || 'Failed to send OTP',
          error: smsResult.error
        });
      }
    }
    
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.post('/api/auth/verify-otp', otpLimiter, async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both phone number and OTP'
      });
    }
    
    // Verify OTP using Firebase
    const verificationResult = await otpService.verifyOTP(phone, otp);
    
    if (verificationResult.success) {
      res.json({
        success: true,
        message: 'OTP verified successfully',
        phone: phone
      });
    } else {
      res.status(400).json({
        success: false,
        message: verificationResult.message
      });
    }
    
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

app.post('/api/auth/resend-otp', otpLimiter, async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit phone number'
      });
    }
    
    // Resend OTP
    const resendResult = await otpService.resendOTP(phone);
    
    if (resendResult.success) {
      res.json({
        success: true,
        message: 'New OTP sent successfully',
        phone: phone,
        // In development, show OTP in console and response
        otp: process.env.NODE_ENV === 'development' ? resendResult.otp : undefined
      });
    } else {
      res.status(400).json({
        success: false,
        message: resendResult.message
      });
    }
    
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Authentication Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { firstName, lastName, phone, password, userType, ...otherFields } = req.body;

    // Validation
    if (!firstName || !lastName || !phone || !password || !userType) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with this phone number already exists' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      firstName,
      lastName,
      phone,
      password: hashedPassword,
      userType,
      ...otherFields
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      error: 'Internal server error during signup' 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Validation
    if (!phone || !password) {
      return res.status(400).json({ 
        error: 'Phone and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        userType: user.userType,
        phone: user.phone 
      },
      'your-secret-key-change-in-production',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
  }
});

// Protected route middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, 'your-secret-key-change-in-production');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Import auth routes
const authRoutes = require('./src/routes/auth/index.js');

// Register auth routes
app.use('/api/auth', otpLimiter, authRoutes);

// Get current user profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.password;
    res.json({ user: userResponse });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Get all users (for admin purposes)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error' 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found' 
  });
});

// Start server
async function startServer() {
  try {
    // Connect to databases
    await connectMongoDB();
    await connectPostgreSQL();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 ACHHADAM Backend Server running on port ${PORT}`);
      console.log(`📊 MongoDB: ${mongoConnection ? '✅ Connected' : '❌ Disconnected'}`);
      console.log(`📊 PostgreSQL: ${postgresConnection ? '✅ Connected' : '❌ Disconnected'}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
      console.log(`🌐 API Base: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  
  if (mongoConnection) {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  }
  
  if (postgresConnection) {
    await postgresConnection.end();
    console.log('✅ PostgreSQL connection closed');
  }
  
  process.exit(0);
});

// Start the server
startServer();
