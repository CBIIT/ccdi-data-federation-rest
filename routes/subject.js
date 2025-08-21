const express = require('express');
const router = express.Router();
const subjectService = require('../services/subjectService');
const { buildLinkHeader } = require('../lib/pagination');
const Joi = require('joi');
const { InvalidParametersError } = require('../lib/errorTypes');

// Allowed filter fields for subjects
const SUBJECT_FILTERS = ['sex','race','ethnicity','vital_status','age_at_vital_status','identifiers','depositions'];
const paginationSchema = Joi.object({
	page: Joi.number().integer().min(1).default(1),
	per_page: Joi.number().integer().min(1).max(1000).default(100)
});

function extractAndValidate(query){
	const { error, value } = paginationSchema.validate({ page: query.page, per_page: query.per_page });
	if (error) throw new InvalidParametersError(['page','per_page'], error.message);
	// unknown filters detection
	const unknown = Object.keys(query).filter(k => !['page','per_page'].includes(k) && !SUBJECT_FILTERS.includes(k));
	if (unknown.length) throw new InvalidParametersError(unknown, 'Unsupported filter parameters');
	return value;
}

router.get('/', (req, res, next) => { try {
	const { page, per_page } = extractAndValidate(req.query);
	const result = subjectService.list({ ...req.query, page, per_page });
	res.set('Link', buildLinkHeader(req, result.pagination.page, result.pagination.per_page, result.pagination.total));
	res.json(result);
} catch(e){ next(e);} });
router.get('/:organization/:namespace/:name', (req,res,next)=>{ try { const {organization, namespace, name}=req.params; res.json(subjectService.get(organization, namespace, name)); } catch(e){ next(e);} });
router.get('/by/:field/count', async (req,res,next)=>{ try { res.json(await subjectService.counts(req.params.field)); } catch(e){ next(e);} });
router.get('/summary', (req,res,next)=>{ try { res.json(subjectService.summary()); } catch(e){ next(e);} });

module.exports = router;
