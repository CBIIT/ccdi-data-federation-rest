const metadataRepo = require('../db/metadataRepository');

function subject() { return { fields: metadataRepo.subjectFields() }; }
function sample() { return { fields: metadataRepo.sampleFields() }; }
function file() { return { fields: metadataRepo.fileFields() }; }

module.exports = { subject, sample, file };
