/** 简单内存缓存，避免每次打开都重新拉取所有 RSS */
const store = new Map();

export function getCache(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache(key, data, ttlMs = 10 * 60 * 1000) {
  store.set(key, { data, expires: Date.now() + ttlMs });
}
