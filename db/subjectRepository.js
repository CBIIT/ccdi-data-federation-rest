const { subjects } = require('./mockData');
const { applyFilters, paginate, groupCounts } = require('./common');

const SUBJECT_FILTER_FIELDS = ['sex', 'race', 'ethnicity', 'vital_status', 'age_at_vital_status', 'identifiers', 'depositions'];
const SUBJECT_COUNT_FIELDS = ['sex', 'race', 'ethnicity', 'vital_status'];

function list({ filters, page, perPage }) {
  const filtered = applyFilters(subjects, filters, SUBJECT_FILTER_FIELDS);
  const total = filtered.length;
  const data = paginate(filtered, page, perPage);
  return { data, total };
}

function get(organization, namespace, name) {
  return subjects.find(s => s.organization === organization && s.namespace === namespace && s.name === name);
}

function countsBy(field) {
  if (!SUBJECT_COUNT_FIELDS.includes(field)) return null;
  return groupCounts(subjects, field);
}

function summary() {
  return {
    total: subjects.length,
    by_sex: groupCounts(subjects, 'sex'),
    by_race: groupCounts(subjects, 'race'),
  };
}

module.exports = {
  list,
  get,
  countsBy,
  summary,
  SUBJECT_COUNT_FIELDS,
};
