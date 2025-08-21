/**
 * Routes: Sample
 * --------------
 * REST interface for Sample entities providing listing with filtering &
 * pagination, individual lookup, grouped field counts and summary aggregates.
 * Swagger annotations document externally visible contract.
 */
const express = require('express');
const router = express.Router();
const sampleService = require('../services/sampleService');
const { buildLinkHeader } = require('../lib/pagination');
const Joi = require('joi');
const { InvalidParametersError } = require('../lib/errorTypes');

const SAMPLE_FILTERS = ['disease_phase','anatomical_sites','library_selection_method','library_strategy','library_source_material','preservation_method','tumor_grade','specimen_molecular_analyte_type','tissue_type','tumor_classification','age_at_diagnosis','age_at_collection','tumor_tissue_morphology','depositions','diagnosis'];
const paginationSchema = Joi.object({ page: Joi.number().integer().min(1).default(1), per_page: Joi.number().integer().min(1).max(1000).default(100)});
function extractAndValidate(q){
  const { error, value } = paginationSchema.validate({ page: q.page, per_page: q.per_page });
  if (error) throw new InvalidParametersError(['page','per_page'], error.message);
  const unknown = Object.keys(q).filter(k => !['page','per_page'].includes(k) && !SAMPLE_FILTERS.includes(k));
  if (unknown.length) throw new InvalidParametersError(unknown, 'Unsupported filter parameters');
  return value;
}

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
router.get('/by/:field/count', async (req, res, next) => {
  try { res.json(await sampleService.counts(req.params.field)); } catch(e){ next(e);} });

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
router.get('/', (req, res, next) => { try {
  const { page, per_page } = extractAndValidate(req.query);
  const result = sampleService.list({ ...req.query, page, per_page });
  res.set('Link', buildLinkHeader(req, result.pagination.page, result.pagination.per_page, result.pagination.total));
  res.json(result);
} catch(e){ next(e);} });

router.get('/:organization/:namespace/:name', (req,res,next)=> { try { const { organization, namespace, name } = req.params; res.json(sampleService.get(organization, namespace, name)); } catch(e){ next(e);} });

router.get('/summary', (req,res,next)=> { try { res.json(sampleService.summary()); } catch(e){ next(e);} });

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
// Deprecated fields endpoint removed in mock implementation

module.exports = router;
