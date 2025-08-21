const { getCache, setCache } = require('../config/redis');

async function cached(key, ttl, producer) {
  const hit = await getCache(key);
  if (hit) return hit;
  const value = await producer();
  await setCache(key, value, ttl);
  return value;
}

module.exports = { cached };
