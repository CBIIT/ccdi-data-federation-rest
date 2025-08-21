const repo = require('../db/organizationRepository');
const { NotFoundError } = require('../lib/errorTypes');

function list() { return repo.list(); }
function get(name) { const o = repo.get(name); if (!o) throw new NotFoundError('Organization', name); return o; }

module.exports = { list, get };
