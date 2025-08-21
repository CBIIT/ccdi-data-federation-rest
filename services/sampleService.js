/**
 * Service: Sample
 * ---------------
 * Orchestrates list/get/count/summary operations for Sample entities. Handles
 * pagination normalization & validation, translates repository misses or
 * unsupported aggregation fields into typed domain errors, and applies simple
 * read‑through caching for count & summary endpoints.
 */
const repo = require('../db/sampleRepository');
const { cached } = require('../lib/cache');
const { UnsupportedFieldError, NotFoundError, InvalidParametersError } = require('../lib/errorTypes');

function list(params) {
  const page = parseInt(params.page) || 1;
  const perPage = parseInt(params.per_page) || 100;
  if (page < 1 || perPage < 1) throw new InvalidParametersError(['page','per_page'], 'Must be positive integers');
  const filters = { ...params };
  delete filters.page; delete filters.per_page;
  const { data, total } = repo.list({ filters, page, perPage });
  return { data, pagination: { page, per_page: perPage, total } };
}

function get(organization, namespace, name) {
  const sample = repo.get(organization, namespace, name);
  if (!sample) throw new NotFoundError('Sample', `${organization}/${namespace}/${name}`);
  return sample;
}

async function counts(field) {
  const data = repo.countsBy(field);
  if (!data) throw new UnsupportedFieldError(field, repo.SAMPLE_COUNT_FIELDS);
  const wrapped = await cached(`sample:count:${field}`, 120, async () => data.map(d => ({ value: d.value, count: d.count })));
  return { field, counts: wrapped };
}

function summary() { return cached('sample:summary', 120, async () => repo.summary()); }

module.exports = { list, get, counts, summary };
