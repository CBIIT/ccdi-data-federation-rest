/**
 * Repository: Namespace
 * ---------------------
 * Surface simple list + lookup operations for Namespace entities (study level
 * context). Keeps data access isolated for future persistence swap.
 */
const { namespaces } = require('./mockData');

function list() { return namespaces; }
function get(organization, namespace) { return namespaces.find(n => n.organization === organization && n.namespace === namespace); }

module.exports = { list, get };
