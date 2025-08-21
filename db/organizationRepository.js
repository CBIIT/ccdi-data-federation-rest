const { organizations } = require('./mockData');

function list() { return organizations; }
function get(name) { return organizations.find(o => o.name === name); }

module.exports = { list, get };
