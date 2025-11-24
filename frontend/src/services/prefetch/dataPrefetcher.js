// Minimal in-memory cache to prepare API data prefetching without changing
// current screens. Use sparingly and hook it to intent signals (hover/focus) or
// navigation heuristics to avoid overwhelming the network.
const dataCache = new Map();

/**
 * Prefetches data and stores the resolved value in memory so it can be reused
 * by the next navigation. The fetcher should be idempotent and cheap.
 *
 * Example usage (do not overuse):
 *
 * prefetchData('user-profile', () => fetchUserProfile(userId));
 */
export function prefetchData(key, fetcher) {
  if (!key || typeof fetcher !== 'function') {
    return Promise.reject(new Error('prefetchData requires a key and a fetcher function'));
  }

  if (dataCache.has(key)) {
    return dataCache.get(key).promise;
  }

  const entry = {
    status: 'loading',
    promise: Promise.resolve()
      .then(() => fetcher())
      .then(result => {
        entry.status = 'ready';
        entry.data = result;
        return result;
      })
      .catch(error => {
        dataCache.delete(key);
        throw error;
      }),
  };

  dataCache.set(key, entry);
  return entry.promise;
}

/**
 * Returns prefetched data when available. The data is evicted on read to keep
 * the cache lean and avoid stale values when the underlying API changes.
 */
export function consumePrefetchedData(key) {
  const entry = dataCache.get(key);
  if (entry?.status === 'ready') {
    dataCache.delete(key);
    return entry.data;
  }
  return undefined;
}

/**
 * Clearing the cache is intentionally manual to give callers full control. Use
 * this in error boundaries or navigation guards if a prefetch needs to be
 * discarded.
 */
export function clearPrefetch(key) {
  if (key === undefined) {
    dataCache.clear();
    return;
  }
  dataCache.delete(key);
}
