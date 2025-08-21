/**
 * Service: Subject
 * ----------------
 * Orchestrates repository calls, enforces pagination sanity & translates
 * missing entities / unsupported aggregation fields into domain errors used
 * by the centralized error handler. Also wraps expensive count/summary calls
 * in a short‑lived cache to reduce repeated computation on hot endpoints.
 */
const repo = require('../db/subjectRepository');
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
  const subject = repo.get(organization, namespace, name);
  if (!subject) throw new NotFoundError('Subject', `${organization}/${namespace}/${name}`);
  return subject;
}

async function counts(field) {
  const data = repo.countsBy(field);
  if (!data) throw new UnsupportedFieldError(field, repo.SUBJECT_COUNT_FIELDS);
  const wrapped = await cached(`subject:count:${field}`, 120, async () => data.map(d => ({ value: d.value, count: d.count })));
  return { field, counts: wrapped };
}

function summary() { return cached('subject:summary', 120, async () => repo.summary()); }

module.exports = { list, get, counts, summary };
