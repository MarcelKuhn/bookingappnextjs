import { LRUCache } from 'lru-cache';

type CacheVal = {}; // schließt null/undefined aus, primitives sind erlaubt

export const cache = new LRUCache<string, CacheVal>({
  max: 500,
  ttl: 1000 * 60 * 15,
});

export function cacheGet<T extends CacheVal>(key: string) {
  return cache.get(key) as T | undefined;
}

export function cacheSet<T extends CacheVal>(key: string, value: T, ttlMs?: number) {
  cache.set(key, value, { ttl: ttlMs });
}
