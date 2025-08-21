const express = require('express');
const router = express.Router();
const { getCache } = require('../config/redis');
const logger = require('../config/logger');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [healthy]
 *                 timestamp:
 *                   type: string
 *                 version:
 *                   type: string
 *                 services:
 *                   type: object
 *                   properties:
 *                     graphql:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *                     redis:
 *                       type: object
 *                       properties:
 *                         status:
 *                           type: string
 *                         timestamp:
 *                           type: string
 *       503:
 *         description: Service is unhealthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   enum: [unhealthy]
 *                 timestamp:
 *                   type: string
 *                 services:
 *                   type: object
 */
router.get('/', async (req, res) => {
  try {
    const timestamp = new Date().toISOString();
    
  // GraphQL removed – mark as deprecated
  const graphqlHealth = { status: 'removed', timestamp };
    
    // Check Redis health (if configured)
    let redisHealth = { status: 'not_configured', timestamp };
    try {
      const testKey = 'health_check_test';
      const testResult = await getCache(testKey);
      redisHealth = { status: 'healthy', timestamp };
    } catch (error) {
      redisHealth = { 
        status: 'unhealthy', 
        error: error.message, 
        timestamp 
      };
    }

  const overallStatus = 'healthy';
    const statusCode = overallStatus === 'healthy' ? 200 : 503;

    const healthResponse = {
      status: overallStatus,
      timestamp,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        graphql: graphqlHealth,
        redis: redisHealth,
      },
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
    };

    logger.info('Health check completed', { 
      status: overallStatus, 
      graphqlStatus: graphqlHealth.status,
      redisStatus: redisHealth.status 
    });

    res.status(statusCode).json(healthResponse);
  } catch (error) {
    logger.error('Health check failed:', error);
    
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    });
  }
});

/**
 * @swagger
 * /health/readiness:
 *   get:
 *     summary: Readiness probe for Kubernetes
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is ready
 *       503:
 *         description: Service is not ready
 */
router.get('/readiness', async (req, res) => {
  try {
    // Check if GraphQL service is accessible
  // GraphQL removed
    
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
});

/**
 * @swagger
 * /health/liveness:
 *   get:
 *     summary: Liveness probe for Kubernetes
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is alive
 */
router.get('/liveness', (req, res) => {
  // Simple liveness check - if the process is running, it's alive
  res.status(200).json({
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

module.exports = router;
