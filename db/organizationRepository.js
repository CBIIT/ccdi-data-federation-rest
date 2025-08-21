/**
 * Repository: Organization
 * -----------------------
 * Exposes list + single entity lookup for Organization records. Abstraction
 * boundary allows upstream services & routes to remain stable when replacing
 * the in-memory mock with a persistent backend.
 */
const { organizations } = require('./mockData');

function list() { return organizations; }
function get(name) { return organizations.find(o => o.name === name); }

module.exports = { list, get };
