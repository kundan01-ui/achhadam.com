"use strict";
const { PrismaClient } = require('@prisma/client');
const mongoose = require('mongoose');
const config = require('./environment');
const logger = require('../utils/logger').default;
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: config.postgresql.url,
        },
    },
    log: config.nodeEnv === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
const connectMongoDB = async () => {
    try {
        await mongoose.connect(config.mongodb.url, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        logger.info('✅ MongoDB connected successfully');
        mongoose.connection.on('error', (error) => {
            logger.error('MongoDB connection error:', error);
        });
        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });
        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });
    }
    catch (error) {
        logger.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};
const connectPostgreSQL = async () => {
    try {
        await prisma.$connect();
        logger.info('✅ PostgreSQL connected successfully');
        await prisma.$queryRaw `SELECT 1`;
        logger.info('✅ PostgreSQL connection test successful');
    }
    catch (error) {
        logger.error('❌ PostgreSQL connection failed:', error);
        process.exit(1);
    }
};
const disconnectDatabases = async () => {
    try {
        await Promise.all([
            prisma.$disconnect(),
            mongoose.disconnect(),
        ]);
        logger.info('✅ Databases disconnected gracefully');
    }
    catch (error) {
        logger.error('❌ Error disconnecting databases:', error);
    }
};
const checkDatabaseHealth = async () => {
    try {
        const postgresql = await prisma.$queryRaw `SELECT 1`
            .then(() => true)
            .catch(() => false);
        const mongodb = mongoose.connection.readyState === 1;
        return { postgresql, mongodb };
    }
    catch (error) {
        logger.error('Database health check failed:', error);
        return { postgresql: false, mongodb: false };
    }
};
module.exports = {
    prisma,
    connectMongoDB,
    connectPostgreSQL,
    disconnectDatabases,
    checkDatabaseHealth,
};
//# sourceMappingURL=database.js.map