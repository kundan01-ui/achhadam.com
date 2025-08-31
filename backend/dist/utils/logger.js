"use strict";
const winston = require('winston');
const config = require('../config/environment');
const logFormat = winston.format.combine(winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss',
}), winston.format.errors({ stack: true }), winston.format.json(), winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta)}`;
    }
    if (stack) {
        log += `\n${stack}`;
    }
    return log;
}));
const consoleFormat = winston.format.combine(winston.format.colorize(), winston.format.timestamp({
    format: 'HH:mm:ss',
}), winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    return log;
}));
const logger = winston.createLogger({
    level: config.logging.level,
    format: logFormat,
    defaultMeta: {
        service: 'achhadam-backend',
        environment: config.nodeEnv,
    },
    transports: [
        new winston.transports.Console({
            format: config.nodeEnv === 'development' ? consoleFormat : logFormat,
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' }),
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log' }),
    ],
});
const fs = require('fs');
const path = require('path');
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}
const morganStream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
const logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};
module.exports = {
    default: logger,
    morganStream,
    logLevels
};
//# sourceMappingURL=logger.js.map