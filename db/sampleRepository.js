/**
 * Repository: Sample
 * ------------------
 * Encapsulates access to Sample entities backed by mock in-memory arrays.
 * Exposes list/get/counts/summary plus exported allowlists that are consumed
 * by higher layers (service + metadata endpoints). Filter logic is centralized
 * so the service layer remains thin and focused on validation / error mapping.
 */
const { samples } = require('./mockData');
const { applyFilters, paginate, groupCounts } = require('./common');

const SAMPLE_FILTER_FIELDS = ['disease_phase','anatomical_sites','library_selection_method','library_strategy','library_source_material','preservation_method','tumor_grade','specimen_molecular_analyte_type','tissue_type','tumor_classification','age_at_diagnosis','age_at_collection','tumor_tissue_morphology','depositions','diagnosis'];
const SAMPLE_COUNT_FIELDS = ['disease_phase','tissue_type','tumor_classification','diagnosis'];

function list({ filters, page, perPage }) {
  const filtered = applyFilters(samples, filters, SAMPLE_FILTER_FIELDS);
  const total = filtered.length;
  const data = paginate(filtered, page, perPage);
  return { data, total };
}

function get(organization, namespace, name) {
  return samples.find(s => s.organization === organization && s.namespace === namespace && s.name === name);
}

function countsBy(field) {
  if (!SAMPLE_COUNT_FIELDS.includes(field)) return null;
  return groupCounts(samples, field);
}

function summary() {
  return {
    total: samples.length,
    by_disease_phase: groupCounts(samples, 'disease_phase'),
    by_tissue_type: groupCounts(samples, 'tissue_type'),
  };
}

module.exports = {
  list,
  get,
  countsBy,
  summary,
  SAMPLE_COUNT_FIELDS,
};
