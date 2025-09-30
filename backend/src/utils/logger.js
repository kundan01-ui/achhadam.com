/**
 * Enterprise-Grade Logging System with Winston
 * Provides structured logging with multiple transports
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// Create logs directory if it doesn't exist
const logDir = config.logging.dir || 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  defaultMeta: { service: 'achhadam-backend' },
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport for non-production
if (config.server.isDevelopment) {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

// Create specialized loggers
const loggers = {
  // General application logger
  app: logger,

  // Database operations logger
  db: logger.child({ component: 'database' }),

  // API request logger
  api: logger.child({ component: 'api' }),

  // Authentication logger
  auth: logger.child({ component: 'auth' }),

  // Payment logger
  payment: logger.child({ component: 'payment' }),

  // Error logger
  error: logger.child({ component: 'error' }),

  // Security logger
  security: logger.child({ component: 'security' }),
};

// Helper methods
loggers.logRequest = (req, res, duration) => {
  loggers.api.info('API Request', {
    method: req.method,
    url: req.url,
    status: res.statusCode,
    duration: `${duration}ms`,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
};

loggers.logError = (error, req = null) => {
  const errorLog = {
    message: error.message,
    stack: error.stack,
    name: error.name,
  };

  if (req) {
    errorLog.request = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };
  }

  loggers.error.error('Application Error', errorLog);
};

loggers.logSecurityEvent = (event, details) => {
  loggers.security.warn('Security Event', {
    event,
    ...details,
    timestamp: new Date().toISOString(),
  });
};

// Stream for Morgan HTTP logger
loggers.stream = {
  write: (message) => {
    loggers.api.info(message.trim());
  },
};

module.exports = loggers;