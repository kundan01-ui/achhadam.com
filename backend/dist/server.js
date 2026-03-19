"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const config = require('./config/environment').default;
const { connectMongoDB, connectPostgreSQL, disconnectDatabases } = require('./config/database');
const logger = require('./utils/logger').default;
const { morganStream } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { notFoundHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/api/users');
const cropRoutes = require('./routes/api/crops');
const orderRoutes = require('./routes/api/orders');
const transportRoutes = require('./routes/api/transport');
const paymentRoutes = require('./routes/api/payments');
const analyticsRoutes = require('./routes/api/analytics');
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: config.security.corsOrigin,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    socket.on('disconnect', () => {
        logger.info(`Client disconnected: ${socket.id}`);
    });
    socket.on('join-user-room', (userId) => {
        socket.join(`user-${userId}`);
        logger.info(`User ${userId} joined their room`);
    });
    socket.on('join-order-room', (orderId) => {
        socket.join(`order-${orderId}`);
        logger.info(`Client joined order room: ${orderId}`);
    });
});
module.exports.io = io;
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
app.use(cors({
  origin: [
    "https://achhadam-com-frontend.vercel.app"
  ],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With']
}));
const limiter = rateLimit({
    windowMs: config.security.rateLimit.windowMs,
    max: config.security.rateLimit.maxRequests,
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: Math.ceil(config.security.rateLimit.windowMs / 1000),
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined', { stream: morganStream }));
app.get('/health', async (req, res) => {
    try {
        const dbHealth = await Promise.resolve().then(() => __importStar(require('./config/database'))).then(db => db.checkDatabaseHealth());
        res.status(200).json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: config.nodeEnv,
            version: '1.0.0',
            databases: dbHealth,
        });
    }
    catch (error) {
        logger.error('Health check failed:', error);
        res.status(500).json({
            status: 'ERROR',
            message: 'Health check failed',
            timestamp: new Date().toISOString(),
        });
    }
});
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.get('/', (req, res) => {
    res.json({
        message: 'ACHHADAM Digital Farming Platform API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        documentation: '/api/docs',
        health: '/health',
    });
});
app.use(notFoundHandler);
app.use(errorHandler);
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await disconnectDatabases();
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully');
    await disconnectDatabases();
    server.close(() => {
        logger.info('Server closed');
        process.exit(0);
    });
});
const startServer = async () => {
    try {
        await Promise.all([
            connectPostgreSQL(),
            connectMongoDB(),
        ]);
        server.listen(config.port, () => {
            logger.info(`🚀 Server running on port ${config.port}`);
            logger.info(`🌍 Environment: ${config.nodeEnv}`);
            logger.info(`📊 Health check: http://localhost:${config.port}/health`);
            logger.info(`🔗 API Base: http://localhost:${config.port}/api`);
        });
    }
    catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
if (require.main === module) {
    startServer();
}
module.exports = app;
//# sourceMappingURL=server.js.map