const express = require('express');
const router = express.Router();
const fileService = require('../services/fileService');
const { buildLinkHeader } = require('../lib/pagination');
const Joi = require('joi');
const { InvalidParametersError } = require('../lib/errorTypes');

const FILE_FILTERS = ['type','size','description','checksums','depositions'];
const paginationSchema = Joi.object({ page: Joi.number().integer().min(1).default(1), per_page: Joi.number().integer().min(1).max(1000).default(100)});
function extractAndValidate(q){
	const { error, value } = paginationSchema.validate({ page: q.page, per_page: q.per_page });
	if (error) throw new InvalidParametersError(['page','per_page'], error.message);
	const unknown = Object.keys(q).filter(k => !['page','per_page'].includes(k) && !FILE_FILTERS.includes(k));
	if (unknown.length) throw new InvalidParametersError(unknown, 'Unsupported filter parameters');
	return value;
}

router.get('/', (req, res, next) => { try {
	const { page, per_page } = extractAndValidate(req.query);
	const result = fileService.list({ ...req.query, page, per_page });
	res.set('Link', buildLinkHeader(req, result.pagination.page, result.pagination.per_page, result.pagination.total));
	res.json(result);
} catch(e){ next(e);} });
router.get('/:organization/:namespace/:name', (req,res,next)=>{ try { const {organization, namespace, name}=req.params; res.json(fileService.get(organization, namespace, name)); } catch(e){ next(e);} });
router.get('/by/:field/count', async (req,res,next)=>{ try { res.json(await fileService.counts(req.params.field)); } catch(e){ next(e);} });
router.get('/summary', (req,res,next)=>{ try { res.json(fileService.summary()); } catch(e){ next(e);} });

module.exports = router;
