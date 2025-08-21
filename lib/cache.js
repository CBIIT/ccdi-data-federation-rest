/**
 * Cache Helper
 * ------------
 * Simple read‑through abstraction around Redis (if configured). Falls back to
 * executing the producer directly when caching is disabled so callers do not
 * need to branch. Intended for inexpensive aggregation & count responses.
 */
const { getCache, setCache } = require('../config/redis');

// cached(key, ttl, producer)
// Simple read-through cache wrapper. If Redis disabled, just executes producer.
async function cached(key, ttl, producer) {
  const hit = await getCache(key);
  if (hit) return hit;
  const value = await producer();
  await setCache(key, value, ttl);
  return value;
}

module.exports = { cached };
