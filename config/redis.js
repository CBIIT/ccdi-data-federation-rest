/**
 * Redis Client Wrapper
 * --------------------
 * Lazily initializes a single shared Redis client when REDIS_URL is provided.
 * Exposes thin promise-based helpers used by the caching abstraction. All
 * methods fail soft (log & return null/false) so upstream handlers never
 * break when Redis is unavailable.
 */
const redis = require('redis');
const logger = require('./logger');

let redisClient = null;

const initRedis = async () => {
  if (!process.env.REDIS_URL) {
    logger.info('Redis URL not provided. Caching disabled.');
    return null;
  }

  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });

    redisClient.on('connect', () => {
      logger.info('Connected to Redis');
    });

    await redisClient.connect();
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    return null;
  }
};

const getCache = async (key) => {
  if (!redisClient) return null;
  
  try {
    const result = await redisClient.get(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    logger.error('Redis GET error:', error);
    return null;
  }
};

const setCache = async (key, data, ttl = parseInt(process.env.REDIS_TTL) || 300) => {
  if (!redisClient) return false;
  
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    logger.error('Redis SET error:', error);
    return false;
  }
};

const deleteCache = async (key) => {
  if (!redisClient) return false;
  
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    logger.error('Redis DELETE error:', error);
    return false;
  }
};

module.exports = {
  initRedis,
  getCache,
  setCache,
  deleteCache,
  client: redisClient,
};
