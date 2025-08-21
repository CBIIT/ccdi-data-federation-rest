/**
 * Service: Info
 * -------------
 * Provides a consolidated snapshot of server + data layer metadata (version,
 * environment, timestamps). Currently static/mock but structured for future
 * expansion (e.g. build git SHA, dependency versions, upstream health).
 */
const repo = require('../db/infoRepository');
function getInfo() { return repo.info(); }
module.exports = { getInfo };
