// Subject Routes
// --------------
// This router exposes REST endpoints for working with Subject entities.
// It delegates domain logic to the subjectService (service layer) which in turn
// calls the repository (data access) working off an in-memory mock dataset.
// Responsibilities here are limited to:
//   * Parsing & validating query/path parameters
//   * Constructing pagination Link headers as per CCDI spec
//   * Translating validation problems into domain errors (InvalidParametersError)
//   * Returning JSON responses
// No business logic or filtering rules should live directly in the route.

const express = require('express');
const router = express.Router();
const subjectService = require('../services/subjectService');
const { buildLinkHeader } = require('../lib/pagination');
const Joi = require('joi');
const { InvalidParametersError } = require('../lib/errorTypes');

// Allowed query filter keys that will be forwarded to the service layer.
// Any unknown keys are rejected to help client developers catch typos early.
const SUBJECT_FILTERS = ['sex','race','ethnicity','vital_status','age_at_vital_status','identifiers','depositions'];
// Schema for pagination. We keep this local to highlight that pagination
// semantics are enforced uniformly across list endpoints.
const paginationSchema = Joi.object({
	page: Joi.number().integer().min(1).default(1),
	per_page: Joi.number().integer().min(1).max(1000).default(100)
});

// Validates pagination & guards against unsupported filter keys.
// Returns normalized pagination values (with defaults applied).
function extractAndValidate(query){
	const { error, value } = paginationSchema.validate({ page: query.page, per_page: query.per_page });
	if (error) throw new InvalidParametersError(['page','per_page'], error.message);
	// Unknown filters detection (reject instead of silently ignoring to be explicit).
	const unknown = Object.keys(query).filter(k => !['page','per_page'].includes(k) && !SUBJECT_FILTERS.includes(k));
	if (unknown.length) throw new InvalidParametersError(unknown, 'Unsupported filter parameters');
	return value; // { page, per_page }
}

// GET /subject
// Lists subjects applying optional filters & pagination.
// Responds with data + pagination object; adds RFC5988 style Link header.
router.get('/', (req, res, next) => { try {
	const { page, per_page } = extractAndValidate(req.query);
	// Forward original filter params; service will slice & shape response.
	const result = subjectService.list({ ...req.query, page, per_page });
	res.set('Link', buildLinkHeader(req, result.pagination.page, result.pagination.per_page, result.pagination.total));
	res.json(result);
} catch(e){ next(e);} });
// GET /subject/:organization/:namespace/:name
// Retrieves a single subject or 404 via NotFoundError handled centrally.
router.get('/:organization/:namespace/:name', (req,res,next)=>{ try {
	const {organization, namespace, name}=req.params;
	res.json(subjectService.get(organization, namespace, name));
} catch(e){ next(e);} });
// GET /subject/by/:field/count
// Returns counts grouped by the provided metadata field.
router.get('/by/:field/count', async (req,res,next)=>{ try {
	res.json(await subjectService.counts(req.params.field));
} catch(e){ next(e);} });
// GET /subject/summary
// Lightweight aggregate stats for quick UI overviews.
router.get('/summary', (req,res,next)=>{ try {
	res.json(subjectService.summary());
} catch(e){ next(e);} });

module.exports = router;
