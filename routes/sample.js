const express = require('express');
const router = express.Router();
const graphqlClient = require('../graphql/client');
const { validateRequest, schemas } = require('../middleware/validation');
const { getCache, setCache } = require('../config/redis');
const { FIELD_TO_QUERY_MAP, SAMPLE_COUNT_QUERIES, SAMPLE_DETAILS_QUERY } = require('../graphql/queries');
const logger = require('../config/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     SampleCount:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *           description: The field value
 *         count:
 *           type: integer
 *           description: Number of samples with this field value
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *             statusCode:
 *               type: integer
 *             timestamp:
 *               type: string
 *             path:
 *               type: string
 *             method:
 *               type: string
 */

/**
 * @swagger
 * /api/v1/sample/by/{field}/count:
 *   get:
 *     summary: Get sample counts grouped by a specific field
 *     tags: [Samples]
 *     parameters:
 *       - in: path
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *           enum: [tumor_status, anatomic_site, tumor_classification, tissue_type, primary_diagnosis]
 *         description: Field to group samples by
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 100
 *         description: Maximum number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SampleCount'
 *       422:
 *         description: Unsupported field
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/by/:field/count', validateRequest(schemas.sampleByFieldCount), async (req, res, next) => {
  try {
    const { field } = req.params;
    const { limit = 100, offset = 0 } = req.query;
    
    // Check if field is supported
    const gqlField = FIELD_TO_QUERY_MAP[field];
    if (!gqlField) {
      return res.status(422).json({
        error: {
          message: `Field '${field}' is not supported`,
          statusCode: 422,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          method: req.method,
          details: {
            kind: 'UnsupportedField',
            field,
            reason: 'This field is not present for samples.',
            supportedFields: Object.keys(FIELD_TO_QUERY_MAP),
          },
        },
      });
    }

    // Generate cache key
    const cacheKey = `sample:${field}:count:${limit}:${offset}`;
    
    // Try to get from cache first
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      logger.info(`Cache hit for ${cacheKey}`);
      return res.json(cachedResult);
    }

    // Get GraphQL query
    const query = SAMPLE_COUNT_QUERIES[gqlField];
    // const variables = { limit: parseInt(limit), offset: parseInt(offset) };

    // Execute GraphQL query
    const data = await graphqlClient.query(query);
    console.log(query); // Debugging line to check the response structure
    if (!data || !data[gqlField]) {
      return res.status(500).json({
        error: {
          message: 'No data returned from GraphQL service',
          statusCode: 500,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          method: req.method,
        },
      });
    }

    const result = data[gqlField];
    
    // Cache the result
    await setCache(cacheKey, result);
    
    logger.info(`Successfully retrieved ${field} counts`, { 
      count: result.length, 
      limit, 
      offset 
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/sample:
 *   get:
 *     summary: Get sample details with optional filtering
 *     tags: [Samples]
 *     parameters:
 *       - in: query
 *         name: tumorStatus
 *         schema:
 *           type: string
 *         description: Filter by tumor status
 *       - in: query
 *         name: anatomicSite
 *         schema:
 *           type: string
 *         description: Filter by anatomic site
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 100
 *         description: Maximum number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get('/', async (req, res, next) => {
  try {
    const { limit = 100, offset = 0, ...filters } = req.query;
    
    // Generate cache key based on filters
    const cacheKey = `samples:${JSON.stringify(filters)}:${limit}:${offset}`;
    
    // Try to get from cache first
    const cachedResult = await getCache(cacheKey);
    if (cachedResult) {
      logger.info(`Cache hit for ${cacheKey}`);
      return res.json(cachedResult);
    }

    // Build GraphQL variables
    const variables = {
      filters: Object.keys(filters).length > 0 ? filters : null,
      limit: parseInt(limit),
      offset: parseInt(offset),
    };

    // Execute GraphQL query
    const data = await graphqlClient.query(SAMPLE_DETAILS_QUERY, variables);
    
    if (!data || !data.samples) {
      return res.status(500).json({
        error: {
          message: 'No data returned from GraphQL service',
          statusCode: 500,
          timestamp: new Date().toISOString(),
          path: req.originalUrl,
          method: req.method,
        },
      });
    }

    const result = {
      data: data.samples,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: data.samples.length, // This would ideally come from a separate count query
      },
    };
    
    // Cache the result
    await setCache(cacheKey, result);
    
    logger.info('Successfully retrieved sample details', { 
      count: data.samples.length, 
      filters, 
      limit, 
      offset 
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/sample/fields:
 *   get:
 *     summary: Get list of supported fields for sample queries
 *     tags: [Samples]
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supportedFields:
 *                   type: array
 *                   items:
 *                     type: string
 *                 fieldMappings:
 *                   type: object
 */
router.get('/fields', (req, res) => {
  res.json({
    supportedFields: Object.keys(FIELD_TO_QUERY_MAP),
    fieldMappings: FIELD_TO_QUERY_MAP,
    description: 'Use these fields in the /by/{field}/count endpoint',
  });
});

module.exports = router;
