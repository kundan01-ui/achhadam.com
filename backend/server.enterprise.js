/**
 * ACHHADAM Backend - Enterprise Edition Server
 * Production-ready Node.js + Express + MongoDB + Redis + WebSocket
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// Load configuration
const config = require('./src/config/config');
const logger = require('./src/utils/logger');
const { sanitize } = require('./src/middleware/validation');
const cacheService = require('./src/services/cacheService');
const socketService = require('./src/services/socketService');
const swagger = require('./src/config/swagger');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// ===========================================
// MIDDLEWARE CONFIGURATION
// ===========================================

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: !config.server.isDevelopment,
  contentSecurityPolicy: config.security.helmetCSPEnabled,
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (config.cors.origins.includes(origin)) {
      callback(null, true);
    } else {
      logger.security.logSecurityEvent('CORS_VIOLATION', {
        origin,
        allowed: config.cors.origins,
      });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  handler: (req, res) => {
    logger.security.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      ip: req.ip,
      url: req.url,
    });
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later',
    });
  },
});

const otpLimiter = rateLimit({
  windowMs: config.rateLimit.otpWindowMs,
  max: config.rateLimit.otpMaxRequests,
  message: {
    success: false,
    message: 'Too many OTP requests, please wait',
  },
});

app.use(limiter);

// HTTP request logging
app.use(morgan('combined', { stream: logger.stream }));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Input sanitization
app.use(sanitize);

// Session middleware
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.session.secure,
    maxAge: config.session.maxAge,
  },
}));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.logRequest(req, res, duration);
  });
  next();
});

// ===========================================
// DATABASE & SERVICES INITIALIZATION
// ===========================================

const mongoose = require('mongoose');

async function initializeServices() {
  try {
    // Connect to MongoDB
    logger.db.info('Connecting to MongoDB...');
    await mongoose.connect(config.database.mongoUri, config.database.options);
    logger.db.info('✅ MongoDB connected successfully');

    // Connect to Redis
    logger.db.info('Connecting to Redis...');
    await cacheService.connect();

    // Initialize WebSocket
    logger.app.info('Initializing WebSocket server...');
    socketService.initialize(server);

    return true;
  } catch (error) {
    logger.error.error('Service initialization failed', {
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
}

// ===========================================
// API DOCUMENTATION
// ===========================================

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Root
 *     description: Get API information and available endpoints
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API information
 */
app.get('/', (req, res) => {
  res.json({
    name: 'ACHHADAM API',
    version: '1.0.0',
    description: 'Digital Farming Platform - RESTful API',
    documentation: '/api-docs',
    health: '/health',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Check API health status
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API is healthy
 */
app.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.env,
    services: {
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      redis: cacheService.isConnected ? 'connected' : 'disconnected',
      websocket: socketService.io ? 'connected' : 'disconnected',
    },
    metrics: {
      onlineUsers: socketService.getOnlineUsersCount(),
      memoryUsage: process.memoryUsage(),
    },
  };

  const statusCode = health.services.mongodb === 'connected' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Swagger documentation
app.use('/api-docs', swagger.serve, swagger.setup);

// ===========================================
// ROUTES
// ===========================================

// Import routes
const authRoutes = require('./src/routes/auth/index');
const passwordResetRoutes = require('./routes/auth');
const cropRoutes = require('./src/routes/crops');
const orderRoutes = require('./src/routes/orders');
const cartRoutes = require('./src/routes/cart');
const cookieRoutes = require('./src/routes/cookieRoutes');

// Register routes
app.use('/api/auth', otpLimiter, authRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/cookies', cookieRoutes);

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use('*', (req, res) => {
  logger.api.warn('404 Not Found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((error, req, res, next) => {
  logger.logError(error, req);

  // Don't leak error details in production
  const message = config.server.isProduction
    ? 'Internal server error'
    : error.message;

  res.status(error.status || 500).json({
    success: false,
    message,
    ...(config.server.isDevelopment && { stack: error.stack }),
  });
});

// ===========================================
// SERVER STARTUP
// ===========================================

async function startServer() {
  try {
    // Initialize services
    await initializeServices();

    // Start server
    server.listen(config.server.port, () => {
      logger.app.info(`
╔═══════════════════════════════════════════════╗
║                                               ║
║     🌾 ACHHADAM Enterprise Server v1.0       ║
║                                               ║
╠═══════════════════════════════════════════════╣
║                                               ║
║  Environment: ${config.server.env.padEnd(31)} ║
║  Port: ${config.server.port.toString().padEnd(38)} ║
║  URL: http://localhost:${config.server.port.toString().padEnd(25)} ║
║                                               ║
║  Services:                                    ║
║  ✅ MongoDB Connected                         ║
║  ✅ Redis Cache ${cacheService.isConnected ? 'Active' : 'Inactive'.padEnd(24)} ║
║  ✅ WebSocket Server Active                   ║
║  ✅ API Documentation: /api-docs              ║
║                                               ║
║  Monitoring:                                  ║
║  📊 Health Check: /health                     ║
║  📝 Logs: ${config.logging.dir}/combined.log${' '.padEnd(16)} ║
║                                               ║
╚═══════════════════════════════════════════════╝
      `);

      logger.app.info('Server started successfully', {
        port: config.server.port,
        env: config.server.env,
        pid: process.pid,
      });
    });

  } catch (error) {
    logger.error.error('Failed to start server', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

// ===========================================
// GRACEFUL SHUTDOWN
// ===========================================

async function gracefulShutdown(signal) {
  logger.app.info(`${signal} received, shutting down gracefully...`);

  // Close server
  server.close(async () => {
    logger.app.info('HTTP server closed');

    try {
      // Disconnect from databases
      await mongoose.connection.close();
      logger.db.info('MongoDB connection closed');

      await cacheService.disconnect();
      logger.db.info('Redis connection closed');

      logger.app.info('✅ Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error.error('Error during shutdown', {
        error: error.message,
      });
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    logger.error.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.error.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack,
  });
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error.error('Unhandled Promise Rejection', {
    reason,
    promise,
  });
});

// Start the server
startServer();

module.exports = { app, server };