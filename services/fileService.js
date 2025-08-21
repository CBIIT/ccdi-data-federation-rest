const repo = require('../db/fileRepository');
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
  const file = repo.get(organization, namespace, name);
  if (!file) throw new NotFoundError('File', `${organization}/${namespace}/${name}`);
  return file;
}

async function counts(field) {
  const data = repo.countsBy(field);
  if (!data) throw new UnsupportedFieldError(field, repo.FILE_COUNT_FIELDS);
  const wrapped = await cached(`file:count:${field}`, 120, async () => data.map(d => ({ value: d.value, count: d.count })));
  return { field, counts: wrapped };
}

function summary() { return cached('file:summary', 120, async () => repo.summary()); }

module.exports = { list, get, counts, summary };
