/**
 * Redis Caching Service
 * Provides high-performance caching for frequently accessed data
 */

const Redis = require('ioredis');
const config = require('../config/config');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.redis = null;
    this.isConnected = false;
    this.fallbackCache = new Map(); // In-memory fallback
  }

  /**
   * Initialize Redis connection
   */
  async connect() {
    try {
      this.redis = new Redis({
        host: config.redis.host,
        port: config.redis.port,
        password: config.redis.password || undefined,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        reconnectOnError: (err) => {
          const targetError = 'READONLY';
          if (err.message.includes(targetError)) {
            return true;
          }
          return false;
        },
      });

      this.redis.on('connect', () => {
        this.isConnected = true;
        logger.db.info('✅ Redis connected successfully');
      });

      this.redis.on('error', (error) => {
        logger.error.error('❌ Redis connection error', { error: error.message });
        this.isConnected = false;
      });

      this.redis.on('reconnecting', () => {
        logger.db.info('🔄 Redis reconnecting...');
      });

      // Test connection
      await this.redis.ping();
      this.isConnected = true;

      return true;
    } catch (error) {
      logger.error.warn('⚠️ Redis unavailable, using in-memory fallback', {
        error: error.message,
      });
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Get value from cache
   */
  async get(key) {
    try {
      if (this.isConnected && this.redis) {
        const value = await this.redis.get(key);
        if (value) {
          logger.db.debug('Cache hit', { key });
          return JSON.parse(value);
        }
      } else {
        // Fallback to in-memory cache
        const value = this.fallbackCache.get(key);
        if (value && value.expiry > Date.now()) {
          return value.data;
        }
      }

      logger.db.debug('Cache miss', { key });
      return null;
    } catch (error) {
      logger.error.error('Cache get error', { key, error: error.message });
      return null;
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(key, value, ttl = 3600) {
    try {
      const serialized = JSON.stringify(value);

      if (this.isConnected && this.redis) {
        await this.redis.setex(key, ttl, serialized);
        logger.db.debug('Cache set', { key, ttl });
      } else {
        // Fallback to in-memory cache
        this.fallbackCache.set(key, {
          data: value,
          expiry: Date.now() + ttl * 1000,
        });
      }

      return true;
    } catch (error) {
      logger.error.error('Cache set error', { key, error: error.message });
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async del(key) {
    try {
      if (this.isConnected && this.redis) {
        await this.redis.del(key);
      } else {
        this.fallbackCache.delete(key);
      }

      logger.db.debug('Cache delete', { key });
      return true;
    } catch (error) {
      logger.error.error('Cache delete error', { key, error: error.message });
      return false;
    }
  }

  /**
   * Delete all keys matching pattern
   */
  async delPattern(pattern) {
    try {
      if (this.isConnected && this.redis) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
        logger.db.debug('Cache pattern delete', { pattern, count: keys.length });
      } else {
        // Fallback: clear all matching keys from memory
        const regex = new RegExp(pattern.replace('*', '.*'));
        for (const key of this.fallbackCache.keys()) {
          if (regex.test(key)) {
            this.fallbackCache.delete(key);
          }
        }
      }

      return true;
    } catch (error) {
      logger.error.error('Cache pattern delete error', { pattern, error: error.message });
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key) {
    try {
      if (this.isConnected && this.redis) {
        const exists = await this.redis.exists(key);
        return exists === 1;
      } else {
        return this.fallbackCache.has(key);
      }
    } catch (error) {
      logger.error.error('Cache exists error', { key, error: error.message });
      return false;
    }
  }

  /**
   * Set multiple values at once
   */
  async mset(keyValuePairs, ttl = 3600) {
    try {
      if (this.isConnected && this.redis) {
        const pipeline = this.redis.pipeline();

        for (const [key, value] of Object.entries(keyValuePairs)) {
          pipeline.setex(key, ttl, JSON.stringify(value));
        }

        await pipeline.exec();
      } else {
        for (const [key, value] of Object.entries(keyValuePairs)) {
          this.fallbackCache.set(key, {
            data: value,
            expiry: Date.now() + ttl * 1000,
          });
        }
      }

      return true;
    } catch (error) {
      logger.error.error('Cache mset error', { error: error.message });
      return false;
    }
  }

  /**
   * Increment counter
   */
  async incr(key) {
    try {
      if (this.isConnected && this.redis) {
        return await this.redis.incr(key);
      } else {
        const current = this.fallbackCache.get(key)?.data || 0;
        const newValue = current + 1;
        this.fallbackCache.set(key, {
          data: newValue,
          expiry: Date.now() + 3600 * 1000,
        });
        return newValue;
      }
    } catch (error) {
      logger.error.error('Cache incr error', { key, error: error.message });
      return null;
    }
  }

  /**
   * Get or set pattern (cache-aside)
   */
  async getOrSet(key, fetchFunction, ttl = 3600) {
    try {
      // Try to get from cache
      const cached = await this.get(key);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, fetch from source
      const fresh = await fetchFunction();

      // Store in cache
      await this.set(key, fresh, ttl);

      return fresh;
    } catch (error) {
      logger.error.error('Cache getOrSet error', { key, error: error.message });
      throw error;
    }
  }

  /**
   * Flush all cache
   */
  async flushAll() {
    try {
      if (this.isConnected && this.redis) {
        await this.redis.flushall();
      } else {
        this.fallbackCache.clear();
      }

      logger.db.info('Cache flushed');
      return true;
    } catch (error) {
      logger.error.error('Cache flush error', { error: error.message });
      return false;
    }
  }

  /**
   * Close Redis connection
   */
  async disconnect() {
    try {
      if (this.redis) {
        await this.redis.quit();
        this.isConnected = false;
        logger.db.info('Redis disconnected');
      }
    } catch (error) {
      logger.error.error('Redis disconnect error', { error: error.message });
    }
  }

  /**
   * Cache middleware for Express routes
   */
  cacheMiddleware(ttl = 300) {
    return async (req, res, next) => {
      // Skip caching for non-GET requests
      if (req.method !== 'GET') {
        return next();
      }

      // Generate cache key from URL and query params
      const cacheKey = `route:${req.originalUrl}`;

      try {
        const cached = await this.get(cacheKey);

        if (cached) {
          logger.api.debug('Serving from cache', { url: req.originalUrl });
          return res.json(cached);
        }

        // Intercept res.json to cache the response
        const originalJson = res.json.bind(res);
        res.json = (body) => {
          this.set(cacheKey, body, ttl);
          return originalJson(body);
        };

        next();
      } catch (error) {
        logger.error.error('Cache middleware error', { error: error.message });
        next();
      }
    };
  }
}

// Export singleton instance
const cacheService = new CacheService();

module.exports = cacheService;