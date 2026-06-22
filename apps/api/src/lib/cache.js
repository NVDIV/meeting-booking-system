const cache = new Map();
const defaultTtlMs = 60 * 1000; // 1 хвилина

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCached(key, value) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + defaultTtlMs
  });
}

function deleteCachedByPrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

module.exports = { getCached, setCached, deleteCachedByPrefix };