const repo = require('../db/diagnosisRepository');
const { InvalidParametersError } = require('../lib/errorTypes');

function sample(params) {
  const term = params.search;
  if (!term) throw new InvalidParametersError(['search'], 'Required for diagnosis search');
  return repo.sampleSearch(term);
}

function subject(params) {
  const term = params.search;
  if (!term) throw new InvalidParametersError(['search'], 'Required for diagnosis search');
  return repo.subjectSearch(term);
}

module.exports = { sample, subject };
