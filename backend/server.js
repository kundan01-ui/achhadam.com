const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config/database');

const app = express();
const PORT = config.server.port;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.server.corsOrigin,
  credentials: true
}));
app.use(limiter);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connections
let mongoConnection = null;
let postgresConnection = null;

// MongoDB Connection
async function connectMongoDB() {
  try {
    mongoConnection = await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

// PostgreSQL Connection
async function connectPostgreSQL() {
  try {
    postgresConnection = new Pool({
      connectionString: config.postgresql.uri,
      ssl: config.postgresql.options.ssl
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
      config.server.jwtSecret,
      { expiresIn: config.server.jwtExpiresIn }
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

    const decoded = jwt.verify(token, config.server.jwtSecret);
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
