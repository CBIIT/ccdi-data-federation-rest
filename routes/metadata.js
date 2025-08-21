/**
 * Routes: Metadata Fields
 * -----------------------
 * Provides discoverable lists of fields for subject, sample and file entities
 * allowing clients to build dynamic filtering & selection UIs.
 */
const express = require('express');
const router = express.Router();
const metadataService = require('../services/metadataService');

router.get('/fields/subject', (req,res)=> res.json(metadataService.subject()));
router.get('/fields/sample', (req,res)=> res.json(metadataService.sample()));
router.get('/fields/file', (req,res)=> res.json(metadataService.file()));

module.exports = router;
