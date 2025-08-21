const express = require('express');
const router = express.Router();
const infoService = require('../services/infoService');

router.get('/', (req,res)=> res.json(infoService.getInfo()));

module.exports = router;
