const redis = require('redis');
const logger = require('./logger');

class CacheService {
  constructor() {
    this.client = null;
    this.connected = false;
  }

  async connect() {
    if (this.connected) return;

    try {
      this.client = redis.createClient({
        url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
        password: process.env.REDIS_PASSWORD,
        database: process.env.REDIS_DB || 0,
        socket: {
          // Exponential backoff: Start 1s, cap at 30s
          reconnectStrategy: (retries) => {
            if (retries > 20) {
              // After 20 retries (~5 mins of failures), log less frequently or just stop?
              // We keep retrying forever but slowly (every 60s)
              return 60000;
            }
            return Math.min(retries * 1000, 30000);
          }
        }
      });

      // Silence "ECONNREFUSED" spam. Only log detailed errors for other issues.
      this.client.on('error', (err) => {
        const isRefused = err.code === 'ECONNREFUSED' ||
          (err.message && err.message.includes('ECONNREFUSED')) ||
          (err.stack && err.stack.includes('ECONNREFUSED'));

        if (isRefused) {
          return;
        }
        logger.error('Redis client error:', err);
      });

      this.client.on('connect', () => {
        // Connected but not yet ready (authenticating etc)
      });

      this.client.on('ready', () => {
        logger.info('Redis Connection Established (Ready)');
        this.connected = true;
      });

      this.client.on('end', () => {
        if (this.connected) {
          logger.warn('Redis Connection Lost');
        }
        this.connected = false;
      });

      await this.client.connect();
    } catch (err) {
      if (err.code === 'ECONNREFUSED') {
        logger.warn(`Redis connection refused at startup. Will retry in background...`);
      } else {
        logger.error('Failed to initiate Redis connection:', err);
      }
      this.connected = false;
    }
  }

  async get(key) {
    if (!this.connected) return null;
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      // If error occurs during get (e.g. sudden disconnect), log/warn and return null
      this.connected = false; // Assume disconnected on error
      return null;
    }
  }

  async set(key, value, expiresIn = 3600) {
    if (!this.connected) return;
    try {
      await this.client.setEx(key, expiresIn, JSON.stringify(value));
    } catch (err) {
      // Silent fail
    }
  }

  async del(key) {
    if (!this.connected) return;
    try {
      await this.client.del(key);
    } catch (err) {
      // Silent fail
    }
  }

  async invalidatePattern(pattern) {
    if (!this.connected) return;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    } catch (err) {
      // Silent fail
    }
  }

  async disconnect() {
    if (this.client) {
      try {
        await this.client.disconnect();
      } catch (e) { /* ignore */ }
      this.connected = false;
    }
  }
}

module.exports = new CacheService();
