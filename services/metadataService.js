/**
 * Service: Metadata
 * -----------------
 * Exposes discoverable field lists for each entity type. Useful for dynamic
 * UI filter construction and documentation endpoints.
 */
const metadataRepo = require('../db/metadataRepository');

function subject() { return { fields: metadataRepo.subjectFields() }; }
function sample() { return { fields: metadataRepo.sampleFields() }; }
function file() { return { fields: metadataRepo.fileFields() }; }

module.exports = { subject, sample, file };
