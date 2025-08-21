const repo = require('../db/infoRepository');
function getInfo() { return repo.info(); }
module.exports = { getInfo };
