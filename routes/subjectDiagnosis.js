/**
 * Routes: Subject Diagnosis Search
 * --------------------------------
 * Performs simple substring searches over subject diagnosis metadata with
 * pagination applied in-route (repository returns full match set currently).
 */
const express = require('express');
const router = express.Router();
const diagnosisService = require('../services/diagnosisService');
const { buildLinkHeader } = require('../lib/pagination');
const Joi = require('joi');
const { InvalidParametersError } = require('../lib/errorTypes');

const paginationSchema = Joi.object({ page: Joi.number().integer().min(1).default(1), per_page: Joi.number().integer().min(1).max(1000).default(100)});
function extractPagination(q){
	const { error, value } = paginationSchema.validate({ page: q.page, per_page: q.per_page });
	if (error) throw new InvalidParametersError(['page','per_page'], error.message);
	return value;
}

router.get('/', (req,res,next)=> { try {
	const { page, per_page } = extractPagination(req.query);
	const all = diagnosisService.subject(req.query);
	const total = all.length;
	const offset = (page-1)*per_page;
	const data = all.slice(offset, offset + per_page);
	res.set('Link', buildLinkHeader(req, page, per_page, total));
	res.json({ data, pagination: { page, per_page, total } });
} catch(e){ next(e);} });

module.exports = router;
