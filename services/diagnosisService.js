/**
 * Service: Diagnosis
 * ------------------
 * Provides simple search helpers for diagnosis related lookups on both samples
 * and subjects. Validates required query parameters and delegates data access
 * to the in-memory repository implementation. Replace the repository with a
 * real data source (e.g. Memgraph / Neo4j) without changing route handlers.
 */
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
