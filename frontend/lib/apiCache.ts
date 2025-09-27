// Lightweight in-memory cache for API route responses with TTL.
// Intended to reduce repeated DB load for hot endpoints in a single Node process.

type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

const apiCache = new Map<string, CacheEntry<any>>();

export function cacheKey(pathname: string, query?: Record<string, any>, userId?: string): string {
  const q = query ? JSON.stringify(query) : '';
  return `${pathname}|${userId ?? ''}|${q}`;
}

export function getCached<T>(key: string): T | undefined {
  const entry = apiCache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    apiCache.delete(key);
    return undefined;
  }
  return entry.value as T;
}

export function setCached<T>(key: string, value: T, ttlMs: number): void {
  apiCache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function withApiCache<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = getCached<T>(key);
  if (cached !== undefined) return Promise.resolve(cached);
  return fetcher().then((data) => {
    setCached(key, data, ttlMs);
    return data;
  });
}

export function cacheHeaders(ttlSeconds: number): Record<string, string> {
  return {
    'Cache-Control': `public, max-age=${ttlSeconds}`,
  };
}


