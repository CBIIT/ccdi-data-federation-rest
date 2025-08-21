const express = require('express');
const router = express.Router();

router.use('/subject', require('./subject'));
router.use('/sample', require('./sample'));
router.use('/file', require('./file'));
router.use('/metadata', require('./metadata'));
router.use('/namespace', require('./namespace'));
router.use('/organization', require('./organization'));
router.use('/info', require('./info'));
router.use('/sample-diagnosis', require('./sampleDiagnosis'));
router.use('/subject-diagnosis', require('./subjectDiagnosis'));

module.exports = router;
