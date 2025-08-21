/**
 * Repository: Metadata (Field Catalog)
 * ------------------------------------
 * Central export point for discoverable field allowlists used by services,
 * routes & client tooling to build dynamic filters or introspection UIs.
 */
const { SUBJECT_COUNT_FIELDS } = require('./subjectRepository');
const { SAMPLE_COUNT_FIELDS } = require('./sampleRepository');
const { FILE_COUNT_FIELDS } = require('./fileRepository');

function subjectFields() { return SUBJECT_COUNT_FIELDS; }
function sampleFields() { return SAMPLE_COUNT_FIELDS; }
function fileFields() { return FILE_COUNT_FIELDS; }

module.exports = { subjectFields, sampleFields, fileFields };
