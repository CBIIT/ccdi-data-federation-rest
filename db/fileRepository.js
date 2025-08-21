const { files } = require('./mockData');
const { applyFilters, paginate, groupCounts } = require('./common');

const FILE_FILTER_FIELDS = ['type','size','description','checksums','depositions'];
const FILE_COUNT_FIELDS = ['type'];

function list({ filters, page, perPage }) {
  const filtered = applyFilters(files, filters, FILE_FILTER_FIELDS);
  const total = filtered.length;
  const data = paginate(filtered, page, perPage);
  return { data, total };
}

function get(organization, namespace, name) {
  return files.find(f => f.organization === organization && f.namespace === namespace && f.name === name);
}

function countsBy(field) {
  if (!FILE_COUNT_FIELDS.includes(field)) return null;
  return groupCounts(files, field);
}

function summary() {
  return {
    total: files.length,
    by_type: groupCounts(files, 'type'),
  };
}

module.exports = {
  list,
  get,
  countsBy,
  summary,
  FILE_COUNT_FIELDS,
};
