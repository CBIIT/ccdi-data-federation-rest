const { samples, subjects } = require('./mockData');

function sampleSearch(term) {
  const t = term.toLowerCase();
  return samples.filter(s => (s.diagnosis || '').toLowerCase().includes(t));
}

function subjectSearch(term) {
  const t = term.toLowerCase();
  return subjects.filter(s => (s.metadata?.associated_diagnoses || '').toLowerCase().includes(t));
}

module.exports = { sampleSearch, subjectSearch };
