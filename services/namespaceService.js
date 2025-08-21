/**
 * Service: Namespace
 * ------------------
 * Returns registered namespaces & supports individual lookups, wrapping
 * not-found conditions into a NotFoundError consumed by the error handler.
 */
const repo = require('../db/namespaceRepository');
const { NotFoundError } = require('../lib/errorTypes');

function list() { return repo.list(); }
function get(organization, namespace) { const n = repo.get(organization, namespace); if (!n) throw new NotFoundError('Namespace', `${organization}/${namespace}`); return n; }

module.exports = { list, get };
