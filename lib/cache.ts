import LRU from 'lru-cache';

export const cache = new LRU<string, any>({
  max: 500,
  ttl: 1000 * 60 * 15 // 15 minutes default
});

export const cacheGet = <T>(key: string) => cache.get(key) as T | undefined;
export const cacheSet = (key: string, value: any, ttlMs?: number) => cache.set(key, value, { ttl: ttlMs });