/**
 * Routes: Namespace
 * -----------------
 * Simple read-only endpoints exposing registered namespaces and lookups.
 */
const express = require('express');
const router = express.Router();
const namespaceService = require('../services/namespaceService');

router.get('/', (req,res)=> res.json(namespaceService.list()));
router.get('/:organization/:namespace', (req,res,next)=> { try { const {organization, namespace} = req.params; res.json(namespaceService.get(organization, namespace)); } catch(e){ next(e);} });

module.exports = router;
