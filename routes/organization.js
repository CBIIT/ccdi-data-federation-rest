const express = require('express');
const router = express.Router();
const organizationService = require('../services/organizationService');

router.get('/', (req,res)=> res.json(organizationService.list()));
router.get('/:name', (req,res,next)=> { try { res.json(organizationService.get(req.params.name)); } catch(e){ next(e);} });

module.exports = router;
