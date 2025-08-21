/**
 * Service: Organization
 * ---------------------
 * Thin layer over the organization repository providing list + get operations
 * while mapping a missing entity lookup to a domain specific NotFoundError.
 */
const repo = require('../db/organizationRepository');
const { NotFoundError } = require('../lib/errorTypes');

function list() { return repo.list(); }
function get(name) { const o = repo.get(name); if (!o) throw new NotFoundError('Organization', name); return o; }

module.exports = { list, get };
