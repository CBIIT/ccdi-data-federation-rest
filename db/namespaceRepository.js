const { namespaces } = require('./mockData');

function list() { return namespaces; }
function get(organization, namespace) { return namespaces.find(n => n.organization === organization && n.namespace === namespace); }

module.exports = { list, get };
